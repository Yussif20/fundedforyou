// Query Builder in Prisma

import { setNestedObject, wrapIfLogical } from "./setNestedObject";
import { makeNestedObject } from "./setNestedObjectForSort";
import { logger } from "@/utils/logger";

type ExtractSelect<T> = T extends { findMany(args: { select: infer S }): any }
  ? S
  : never;

class QueryBuilder<
  ModelDelegate extends { findMany: Function; count: Function },
> {
  private model: ModelDelegate;
  private query: Record<string, unknown>;
  private prismaQuery: any = {};
  private primaryKeyField: string = "id"; // Default primary key field

  constructor(model: ModelDelegate, query: Record<string, unknown>) {
    this.model = model;
    this.query = query;
  }

  /** Merge conditions into the where clause (e.g. to exclude soft-deleted rows). */
  where(conditions: object) {
    this.prismaQuery.where = {
      ...this.prismaQuery.where,
      ...conditions,
    };
    return this;
  }

  // Search
  search(searchableFields: string[]) {
    const q = this.query.searchTerm as string;

    if (q) {
      this.prismaQuery.where = {
        ...this.prismaQuery.where,
        OR: searchableFields.map((field) => {
          if (field.includes(".")) {
            const [parentField, childField] = field.split(".");
            return {
              [parentField]: {
                is: {
                  [childField]: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            };
          }
          return {
            [field]: {
              contains: q,
              mode: "insensitive",
            },
          };
        }),
      };
    }

    return this;
  }

  // Filter
  filter() {
    try {
      const queryObj = { ...this.query };
      const excludeFields = [
        "searchTerm",
        "sort",
        "limit",
        "page",
        "fields",
        "exclude",
      ];
      excludeFields.forEach((field) => delete queryObj[field]);

      const formattedFilters: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(queryObj)) {
        setNestedObject(formattedFilters, key, value);
      }

      const newFormatedFilters = Object.assign(
        {},
        ...Object.entries(formattedFilters).map((item) =>
          wrapIfLogical(item[0], item[1])
        )
      );

      // If we already have conditions in where (like OR from search)
      // we need to combine them with AND
      if (this.prismaQuery.where && Object.keys(this.prismaQuery.where).length > 0 && Object.keys(newFormatedFilters).length > 0) {
        this.prismaQuery.where = {
          AND: [
            this.prismaQuery.where,
            newFormatedFilters,
          ],
        };
      } else {
        this.prismaQuery.where = {
          ...this.prismaQuery.where,
          ...newFormatedFilters,
        };
      }
    } catch (error) {
      logger.error(`Error in filter(): ${error}`, { type: 'ERROR' });
      throw error;
    }

    return this;
  }

  // Sorting
  sort() {
    const sort = (this.query.sort as string)?.split(",") || ["-createdAt"];
    this.prismaQuery.orderBy = sort.map((field) =>
      field.startsWith("-")
        ? makeNestedObject(field.slice(1), "desc")
        : makeNestedObject(field, "asc")
    );
    return this;
  }

  // Pagination
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.prismaQuery.skip = skip;
    this.prismaQuery.take = limit;

    return this;
  }

  // Fields Selection
  fields() {
    const fieldsParam = this.query.fields as string;
    if (fieldsParam) {
      const fields = fieldsParam
        .split(",")
        .filter((field) => field.trim() !== "");

      if (fields.length > 0) {
        this.prismaQuery.select = {};
        fields.forEach((field) => {
          const trimmedField = field.trim();
          if (trimmedField.startsWith("-")) {
            this.prismaQuery.select[trimmedField.slice(1)] = false;
          } else {
            this.prismaQuery.select[trimmedField] = true;
          }
        });

        const hasAtLeastOneTrueField = Object.values(
          this.prismaQuery.select
        ).some((value) => value === true);
        if (!hasAtLeastOneTrueField) {
          this.prismaQuery.select[this.primaryKeyField] = true;
        }
      }
    }
    return this;
  }

  customFields(data: ExtractSelect<ModelDelegate>) {
    if (data) {
      this.prismaQuery.select = data;
    }
    return this;
  }

  // Exclude Fields
  exclude() {
    const excludeParam = this.query.exclude as string;
    if (excludeParam) {
      const excludeFields = excludeParam
        .split(",")
        .filter((field) => field.trim() !== "");

      if (!this.prismaQuery.select) {
        this.prismaQuery.select = {};
      }

      excludeFields.forEach((field) => {
        this.prismaQuery.select[field.trim()] = false;
      });

      const hasAtLeastOneTrueField = Object.values(
        this.prismaQuery.select
      ).some((value) => value === true);
      if (!hasAtLeastOneTrueField) {
        this.prismaQuery.select[this.primaryKeyField] = true;
      }
    }
    return this;
  }

  // Include Relations
  include(includeConfig: any) {
    if (includeConfig) {
      // Remove relation fields from select and move to include
      if (this.prismaQuery.select) {
        Object.keys(includeConfig).forEach((relationField) => {
          if (this.prismaQuery.select && relationField in this.prismaQuery.select) {
            delete this.prismaQuery.select[relationField];
          }
        });
      }
      this.prismaQuery.include = includeConfig;
    }
    return this;
  }

  // Execute Query
  async execute() {
    // If we have both select and include, we need to handle conflict
    // Prisma doesn't allow select and include on same query
    if (this.prismaQuery.select && this.prismaQuery.include) {
      // Remove select completely and use include only
      delete this.prismaQuery.select;
    } else if (this.prismaQuery.select) {
      if (Object.keys(this.prismaQuery.select).length === 0) {
        delete this.prismaQuery.select;
      }

      if (this.query.fields) {
        const hasAtLeastOneTrueField = Object.values(
          this.prismaQuery.select
        ).some((value) => value === true);
        if (!hasAtLeastOneTrueField) {
          this.prismaQuery.select[this.primaryKeyField] = true;
        }
      }
    }

    try {
      // Run findMany and count in parallel
      const [results, total] = await Promise.all([
        this.model.findMany(this.prismaQuery),
        this.model.count({ where: this.prismaQuery.where }),
      ]);

      // Handle removing primary key from results if requested
      let processedResults = results;
      if (this.query.fields && results.length > 0) {
        const fieldsRequested = (this.query.fields as string)
          .split(",")
          .map((f) => f.trim());
        if (!fieldsRequested.includes(this.primaryKeyField)) {
          processedResults = results.map((item: Record<string, unknown>) => {
            const newItem = { ...item };
            delete newItem[this.primaryKeyField];
            return newItem;
          });
        }
      }

      const page = Number(this.query.page) || 1;
      const limit = Number(this.query.limit) || 10;

      return {
        data: processedResults,
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error('========== PRISMA EXECUTE ERROR ==========');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('==========================================');
      throw error;
    }
  }
}

export default QueryBuilder;
