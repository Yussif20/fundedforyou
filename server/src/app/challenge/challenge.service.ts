import { prisma } from "@/db";
import QueryBuilder from "@/helpers/prisma/query-builder";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";

const createChallenge = catchAsync(async (req, res) => {
  const data = req.body;
  await prisma.firm.findUniqueOrThrow({ where: { id: data.firmId } });
  const result = await prisma.challenge.create({ data });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Challenge created successfully",
    data: result,
  });
});

const updateChallenge = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  if (data.firmId) {
    await prisma.firm.findUniqueOrThrow({ where: { id: data.firmId } });
  }
  const result = await prisma.challenge.update({ where: { id }, data });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Challenge updated successfully",
    data: result,
  });
});

const deleteChallenge = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await prisma.challenge.update({
    where: { id },
    data: { isDeleted: true },
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Challenge deleted successfully",
    data: result,
  });
});

const getAllChallenge = catchAsync(async (req, res) => {
  const query: Record<string, any> = req.query;
  const isAdmin = (req as any).user?.role === "SUPER_ADMIN";
  query.isDeleted = false;
  if (!isAdmin) {
    query.hidden = false;
  }

  // Map API param "size" to Prisma field "accountSize" (Challenge model has no "size")
  if (query.size !== undefined) {
    query.accountSize = typeof query.size === "string" ? Number(query.size) : query.size;
    delete query.size;
  }

  // Map API param "firmType" to relation filter (Challenge has no firmType; it's on Firm)
  // Use dot-notation so it merges correctly with other firm.* filters (e.g. firm.slug)
  if (query.firmType !== undefined) {
    query["firm.firmType"] = query.firmType;
    delete query.firmType;
  }

  // Hide challenges belonging to hidden firms for non-admins
  // Use dot-notation to avoid overwriting other firm.* filters (e.g. firm.slug)
  if (!isAdmin) {
    query["firm.hidden"] = false;
  }

  if (query["firm.range_yearsInOperation"]) {
    const range = query["firm.range_yearsInOperation"].split("-");
    //range_yearsInOperation= 1-2 || 2-5 || 5+
    const isPlus = range[0].includes("+");
    const firstYearNumber =
      range.length === 1 ? (isPlus ? Number(range[0]) : 0) : Number(range[0]);
    const secondYearNumber =
      range.length === 1 ? (isPlus ? 0 : Number(range[0])) : Number(range[1]);

    const currentYear = new Date().getFullYear();
    const firstYear = currentYear - firstYearNumber;
    const lastYear = currentYear - secondYearNumber;
    query["firm.dateEstablished"] = {
      ...(isPlus ||
        (range.length > 1 && {
          lte: new Date(new Date().setFullYear(firstYear)),
        })),
      ...(!isPlus && {
        gte: new Date(
          new Date().setFullYear(
            lastYear,
            new Date().getMonth() <= 5 ? 0 : 6,
            1,
          ),
        ),
      }),
    };
    delete query["firm.range_yearsInOperation"];
  }

  if (!query.sort) {
    query.sort = "order";
  }

  const firmQuery = new QueryBuilder(prisma.challenge, query);
  const result = await firmQuery
    .search(["title", "firm.title", "affiliateLink"])
    .customFields({
      id: true,
      accountSize: true,
      copyTrading: true,
      createdAt: true,
      dailyLoss: true,
      EAs: true,
      maxLeverage: true,
      activationFees: true,
      maxLoss: true,
      maxLostType: true,
      minTradingDays: true,
      newsTrading: true,
      overnightHolding: true,
      affiliateLink: true,
      payoutFrequency: true,
      payoutFrequencyArabic: true,
      profitSplit: true,
      price: true,
      resetType: true,
      challengeName: true,
      challengeNameId: true,
      profitTarget: true,
      refundableFee: true,
      steps: true,
      stopLossRequired: true,
      timeLimit: true,
      weekend: true,
      title: true,
      updatedAt: true,
      firmId: true,
      order: true,
      hidden: true,
    })
    .filter()
    .sort()
    .paginate()
    .exclude()
    .include({
      challengeNameRel: {
        select: {
          id: true,
          name: true,
          nameArabic: true,
          discountPercentage: true,
        },
      },
      firm: {
        select: {
          id: true,
          slug: true,
          title: true,
          logoUrl: true,
          platforms: true,
          programTypes: true,
          challengeNames: true,
          challengeNameRecords: {
            where: { isDeleted: false },
            orderBy: { order: "asc" },
            select: {
              id: true,
              name: true,
              nameArabic: true,
              discountPercentage: true,
              order: true,
            },
          },
          maxAllocation: true,
          country: true,
        },
      },
    })
    .execute();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Challenge fetched successfully",
    ...result,
  });
});

const getSingleChallenge = catchAsync(async (req, res) => {
  const id = req.params.id;
  const isAdmin = (req as any).user?.role === "SUPER_ADMIN";
  const result = await prisma.challenge.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
      ...(!isAdmin && { hidden: false }),
    },
    select: {
      id: true,
      hidden: true,
      accountSize: true,
      copyTrading: true,
      createdAt: true,
      dailyLoss: true,
      affiliateLink: true,
      EAs: true,
      maxLeverage: true,
      activationFees: true,
      maxLoss: true,
      maxLostType: true,
      minTradingDays: true,
      newsTrading: true,
      overnightHolding: true,
      payoutFrequency: true,
      payoutFrequencyArabic: true,
      profitSplit: true,
      price: true,
      resetType: true,
      challengeName: true,
      challengeNameId: true,
      challengeNameRel: {
        select: {
          id: true,
          name: true,
          nameArabic: true,
          discountPercentage: true,
        },
      },
      profitTarget: true,
      refundableFee: true,
      steps: true,
      stopLossRequired: true,
      timeLimit: true,
      weekend: true,
      title: true,
      updatedAt: true,
      firmId: true,
      firm: {
        select: {
          id: true,
          title: true,
          logoUrl: true,
          platforms: true,
          programTypes: true,
          maxAllocation: true,
          country: true,
        },
      },
    },
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Challenge fetched successfully",
    data: result,
  });
});

const reorderChallenges = catchAsync(async (req, res) => {
  const { challenges } = req.body;

  if (!challenges || !Array.isArray(challenges)) {
    throw new Error("Invalid challenges data");
  }

  // Update order for each challenge using updateMany to avoid errors if record doesn't exist
  await prisma.$transaction(
    challenges.map((challenge: { id: string; order: number }) =>
      prisma.challenge.updateMany({
        where: { id: challenge.id },
        data: { order: challenge.order },
      })
    )
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Challenges reordered successfully",
  });
});

const changeIndexOfChallenge = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const { order } = req.body;

  if (order === undefined || order === null) {
    throw new Error('Order is required');
  }

  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.challenge.findUniqueOrThrow({
      where: { id, isDeleted: false },
      select: { order: true },
    });

    const oldOrder = item.order || 0;

    if (oldOrder === order) {
      return null;
    }

    if (order < oldOrder) {
      await tx.challenge.updateMany({
        where: {
          order: {
            gte: order,
            lt: oldOrder,
          },
          isDeleted: false,
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    } else {
      await tx.challenge.updateMany({
        where: {
          order: {
            gt: oldOrder,
            lte: order,
          },
          isDeleted: false,
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    }

    return await tx.challenge.update({
      where: { id, isDeleted: false },
      data: { order },
    });
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Challenge order changed successfully",
    data: result,
  });
});

export const ChallengeService = {
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getAllChallenge,
  getSingleChallenge,
  reorderChallenges,
  changeIndexOfChallenge,
};
