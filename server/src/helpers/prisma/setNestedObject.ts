/**
 * Prisma list-relation filter: relationName.some.id in [ids].
 * Used for paths like "payoutMethods.array_id" or "paymentMethods.array_id".
 */
const setRelationArrayFilter = (
  obj: Record<string, any>,
  relationKey: string,
  value: unknown,
  useOr: boolean
) => {
  if (typeof value !== "string" || !value.trim()) return;
  const values = value.split(",").map((v) => v.trim()).filter(Boolean);
  if (values.length === 0) return;
  obj[relationKey] = useOr
    ? { OR: values.map((id) => ({ some: { id } })) }
    : { some: { id: { in: values } } };
};

export const setNestedObject = (
  obj: Record<string, any>,
  path: string,
  value: unknown
) => {
  const keys = path.split(".");
  let current = obj;

  // List-relation filters (e.g. payoutMethods.array_id, paymentMethods.arraySome_id):
  // produce relationName: { some: { id: { in: [...] } } } instead of wrapping in "is"
  if (keys.length === 2) {
    const [relationKey, lastKey] = keys;
    const prefix = lastKey.startsWith("arraySome_") ? "arraySome" : lastKey.startsWith("array_") ? "array" : null;
    if (prefix === "array" || prefix === "arraySome") {
      setRelationArrayFilter(obj, relationKey, value, prefix === "arraySome");
      return;
    }
  }

  if (keys.length > 1) {
    // This is a nested path (relation field in Prisma)
    // We need to wrap ONLY the first key with 'is' for Prisma relations
    const firstKey = keys[0];
    
    // Initialize or wrap the first key with 'is'
    if (!current[firstKey]) {
      current[firstKey] = { is: {} };
    } else if (!current[firstKey].is) {
      // Key exists but no 'is' wrapper - create it
      current[firstKey] = { is: {} };
    }
    
    // Move into the 'is' wrapper
    current = current[firstKey].is;
    
    // Navigate through middle keys (if any) - these are NOT wrapped with 'is'
    for (let i = 1; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    // Set the final value
    const lastKey = keys[keys.length - 1];
    handleLastKey(obj, keys, current, lastKey, value);
  } else {
    // Single key - direct field, no relation, no 'is' wrapper
    const lastKey = keys[0];
    handleLastKey(obj, keys, current, lastKey, value);
  }
};

const handleLastKey = (
  obj: Record<string, any>,
  keys: string[],
  current: Record<string, any>,
  key: string,
  value: unknown
) => {
  const { prefix, fieldName } = parseKeyPrefix(key);

  switch (prefix) {
    case "range":
      handleRange(current, fieldName, value);
      break;
    case "array":
      handleArrayEvery(keys, current, fieldName, value);
      break;
    case "arraySome":
      handleArraySome(keys, current, fieldName, value);
      break;
    case "oneItemArray":
      handleOneItemArray(obj, keys, fieldName, value);
      break;
    case "oneItemArraySome":
      handleOneItemArraySome(obj, keys, fieldName, value);
      break;
    case "in":
      handleIn(current, fieldName, value);
      break;
    case "inNumber":
      handleInNumber(current, fieldName, value);
      break;
    default:
      current[fieldName] = value;
  }
};

const parseKeyPrefix = (key: string) => {
  const prefixes = [
    { name: "oneItemArray", length: 13 },
    { name: "oneItemArraySome", length: 17 },
    { name: "arraySome", length: 10 },
    { name: "inNumber", length: 9 },
    { name: "array", length: 6 },
    { name: "range", length: 6 },
    { name: "in", length: 3 },
  ];

  for (const { name, length } of prefixes) {
    if (key.startsWith(`${name}_`)) {
      return { prefix: name, fieldName: key.slice(length) };
    }
  }

  return { prefix: null, fieldName: key };
};

const handleRange = (
  current: Record<string, any>,
  fieldName: string,
  value: unknown
) => {
  if (typeof value === "string") {
    if (value.includes("-")) {
      const [min, max] = value.split("-").map(Number);
      if (!isNaN(min) && (isNaN(max) || !isNaN(max))) {
        current[fieldName] = {
          gte: min,
          ...(!isNaN(max) ? { lte: max } : {}),
        };
      } else {
        current[fieldName] = value;
      }
    } else if (!isNaN(Number(value))) {
      current[fieldName] = { gte: Number(value) };
    } else {
      current[fieldName] = value;
    }
  } else if (typeof value === "number") {
    current[fieldName] = { gte: value };
  } else {
    current[fieldName] = value;
  }
};

const handleArrayEvery = (
  keys: string[],
  current: Record<string, any>,
  fieldName: string,
  value: unknown
) => {
  if (typeof value === "string") {
    const values = value.split(",").map((v) => v.trim());
    if (keys.length > 1) {
      current["AND"] = values.map((id) => ({
        some: { [fieldName]: id },
      }));
    } else {
      current[fieldName] = { hasEvery: values };
    }
  }
};

const handleArraySome = (
  keys: string[],
  current: Record<string, any>,
  fieldName: string,
  value: unknown
) => {
  if (typeof value === "string") {
    const values = value.split(",").map((v) => v.trim());
    if (keys.length > 1) {
      current["OR"] = values.map((id) => ({
        some: { [fieldName]: id },
      }));
    } else {
      current[fieldName] = { hasSome: values };
    }
  }
};

const handleOneItemArray = (
  obj: Record<string, any>,
  keys: string[],
  fieldName: string,
  value: unknown
) => {
  if (typeof value === "string") {
    const values = value.split(",").map((v) => v.trim());

    if (keys.length > 2) {
      // Promote AND to parent level
      const parentKeyIndex = keys.length - 2;
      let parent = obj;

      for (let i = 0; i < parentKeyIndex; i++) {
        if (!parent[keys[i]] || typeof parent[keys[i]] !== "object") {
          parent[keys[i]] = {};
        }
        parent = parent[keys[i]];
        // Navigate through Prisma 'is' wrapper for relation fields
        if (parent && parent.is && typeof parent.is === "object") {
          parent = parent.is;
        }
      }

      parent["AND"] = values.map((id) => ({
        [keys[parentKeyIndex]]: { some: { [fieldName]: id } },
      }));
    } else {
      // Set hasEvery at current level
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
        // Navigate through Prisma 'is' wrapper for relation fields
        if (current && current.is && typeof current.is === "object") {
          current = current.is;
        }
      }
      current[fieldName] = { hasEvery: values };
    }
  }
};

const handleOneItemArraySome = (
  obj: Record<string, any>,
  keys: string[],
  fieldName: string,
  value: unknown
) => {
  if (typeof value === "string") {
    const values = value.split(",").map((v) => v.trim());

    if (keys.length > 2) {
      // Promote OR to parent level
      const parentKeyIndex = keys.length - 2;
      let parent = obj;

      for (let i = 0; i < parentKeyIndex; i++) {
        if (!parent[keys[i]] || typeof parent[keys[i]] !== "object") {
          parent[keys[i]] = {};
        }
        parent = parent[keys[i]];
        // Navigate through Prisma 'is' wrapper for relation fields
        if (parent && parent.is && typeof parent.is === "object") {
          parent = parent.is;
        }
      }

      parent["OR"] = values.map((id) => ({
        [keys[parentKeyIndex]]: { some: { [fieldName]: id } },
      }));
    } else {
      // Set hasSome at current level
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
        // Navigate through Prisma 'is' wrapper for relation fields
        if (current && current.is && typeof current.is === "object") {
          current = current.is;
        }
      }
      current[fieldName] = { hasSome: values };
    }
  }
};

const handleIn = (
  current: Record<string, any>,
  fieldName: string,
  value: unknown
) => {
  current[fieldName] = {
    in: (value as string).split(",").map((v) => v.trim()),
  };
};

const handleInNumber = (
  current: Record<string, any>,
  fieldName: string,
  value: unknown
) => {
  current[fieldName] = {
    in: (value as string).split(",").map((v) => Number(v.trim())),
  };
};

type LogicalOperator = "AND" | "OR";

export function wrapIfLogical(key: string, value: any): Record<string, any> {
  const firstKey = Object.keys(value)[0] as string;

  if (firstKey === "AND" || firstKey === "OR") {
    const operator = firstKey as LogicalOperator;
    return {
      [operator]: value[operator].map((cond: any) => ({ [key]: cond })),
    };
  }

  return { [key]: value };
}
