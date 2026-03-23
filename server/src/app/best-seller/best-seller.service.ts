import { prisma } from "@/db";
import QueryBuilder from "@/helpers/prisma/query-builder";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { BestSeller } from "@prisma/client";
import httpStatus from "http-status";

const createBestSeller = catchAsync(async (req, res) => {
  const data: BestSeller = req.body;
  await prisma.firm.findUniqueOrThrow({
    where: {
      id: data.firmId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  // Set weeklyRank
  const lastBestSeller = await prisma.bestSeller.findFirst({
    orderBy: {
      weeklyRank: "desc",
    },
    take: 1,
    select: {
      weeklyRank: true,
    },
  });
  if (lastBestSeller) {
    data.weeklyRank = lastBestSeller.weeklyRank + 1;
  } else {
    data.weeklyRank = 1;
  }

  // Set monthlyRank
  const lastBestSellerMonthly = await prisma.bestSeller.findFirst({
    orderBy: {
      monthlyRank: "desc",
    },
    take: 1,
    select: {
      monthlyRank: true,
    },
  });
  if (lastBestSellerMonthly) {
    data.monthlyRank = lastBestSellerMonthly.monthlyRank + 1;
  } else {
    data.monthlyRank = 1;
  }

  // Set rank
  const lastBestSellerRank = await prisma.bestSeller.findFirst({
    orderBy: {
      rank: "desc",
    },
    take: 1,
    select: {
      rank: true,
    },
  });
  if (lastBestSellerRank) {
    data.rank = lastBestSellerRank.rank + 1;
  } else {
    data.rank = 1;
  }

  const result = await prisma.bestSeller.create({
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best seller created successfully",
    data: result,
  });
});

const updateBestSeller = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data: BestSeller = req.body;
  if (data.firmId) {
    await prisma.firm.findUniqueOrThrow({
      where: {
        id: data.firmId,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });
  }
  const result = await prisma.bestSeller.update({
    where: {
      id,
    },
    data,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best seller updated successfully",
    data: result,
  });
});

const handleChangeIndexOfWeeklyBestSeller = catchAsync(async (req, res) => {
  const id = req.params.id;
  const newRank = req.body.index;
  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.bestSeller.findUniqueOrThrow({
      where: { id },
      select: { weeklyRank: true },
    });

    const oldRank = item.weeklyRank;

    if (oldRank === newRank) {
      return null;
    }

    if (newRank < oldRank) {
      await tx.bestSeller.updateMany({
        where: {
          weeklyRank: {
            gte: newRank,
            lt: oldRank,
          },
        },
        data: {
          weeklyRank: {
            increment: 1,
          },
        },
      });
    } else {
      await tx.bestSeller.updateMany({
        where: {
          weeklyRank: {
            gt: oldRank,
            lte: newRank,
          },
        },
        data: {
          weeklyRank: {
            decrement: 1,
          },
        },
      });
    }

    return await tx.bestSeller.update({
      where: { id },
      data: { weeklyRank: newRank },
    });
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best seller updated successfully",
    data: result,
  });
});

const handleChangeIndexOfMonthlyBestSeller = catchAsync(async (req, res) => {
  const id = req.params.id;
  const newRank = req.body.index;

  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.bestSeller.findUniqueOrThrow({
      where: { id },
      select: { monthlyRank: true },
    });

    const oldRank = item.monthlyRank;

    if (oldRank === newRank) {
      return null;
    }

    if (newRank < oldRank) {
      await tx.bestSeller.updateMany({
        where: {
          monthlyRank: {
            gte: newRank,
            lt: oldRank,
          },
        },
        data: {
          monthlyRank: {
            increment: 1,
          },
        },
      });
    } else {
      await tx.bestSeller.updateMany({
        where: {
          monthlyRank: {
            gt: oldRank,
            lte: newRank,
          },
        },
        data: {
          monthlyRank: {
            decrement: 1,
          },
        },
      });
    }

    return await tx.bestSeller.update({
      where: { id },
      data: { monthlyRank: newRank },
    });
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best seller updated successfully",
    data: result,
  });
});

const handleChangeIndexOfRankBestSeller = catchAsync(async (req, res) => {
  const id = req.params.id;
  const newRank = req.body.index;

  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.bestSeller.findUniqueOrThrow({
      where: { id },
      select: { rank: true },
    });

    const oldRank = item.rank;

    if (oldRank === newRank) {
      return null;
    }

    if (newRank < oldRank) {
      await tx.bestSeller.updateMany({
        where: {
          rank: {
            gte: newRank,
            lt: oldRank,
          },
        },
        data: {
          rank: {
            increment: 1,
          },
        },
      });
    } else {
      await tx.bestSeller.updateMany({
        where: {
          rank: {
            gt: oldRank,
            lte: newRank,
          },
        },
        data: {
          rank: {
            decrement: 1,
          },
        },
      });
    }

    return await tx.bestSeller.update({
      where: { id },
      data: { rank: newRank },
    });
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best seller updated successfully",
    data: result,
  });
});

const deleteBestSeller = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.bestSeller.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        weeklyRank: true,
        monthlyRank: true,
        rank: true,
      },
    });

    await tx.bestSeller.delete({
      where: { id },
    });

    await tx.bestSeller.updateMany({
      where: {
        weeklyRank: {
          gt: data.weeklyRank,
        },
      },
      data: {
        weeklyRank: {
          decrement: 1,
        },
      },
    });

    await tx.bestSeller.updateMany({
      where: {
        monthlyRank: {
          gt: data.monthlyRank,
        },
      },
      data: {
        monthlyRank: {
          decrement: 1,
        },
      },
    });

    await tx.bestSeller.updateMany({
      where: {
        rank: {
          gt: data.rank,
        },
      },
      data: {
        rank: {
          decrement: 1,
        },
      },
    });

    return data;
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best seller deleted successfully",
    data: result,
  });
});

const getBestSeller = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await prisma.bestSeller.findUniqueOrThrow({
    where: {
      id,
      firm: {
        isDeleted: false,
      },
    },
    select: {
      id: true,
      weeklyRank: true,
      monthlyRank: true,
      rank: true,
      type: true,
      firmId: true,
      createdAt: true,
      updatedAt: true,
      firm: {
        select: {
          id: true,
          title: true,
          slug: true,
          logoUrl: true,
          offers: {
            where: { isDeleted: false, showInBanner: true },
            take: 1,
            select: {
              id: true,
              code: true,
              offerPercentage: true,
              text: true,
              textArabic: true,
              showGift: true,
              isExclusive: true,
            },
          },
        },
      },
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best seller fetched successfully",
    data: result,
  });
});

const getAllBestSeller = catchAsync(async (req, res) => {
  const query: Record<string, any> = req.query;

  query.sort = query.sort || "rank";
  query.firm = {
    isDeleted: false,
  };
  const bestSellerQuery = new QueryBuilder(prisma.bestSeller, query);
  const result = await bestSellerQuery
    .search(["firm.title"])
    .sort()
    .paginate()
    .customFields({
      id: true,
      weeklyRank: true,
      monthlyRank: true,
      rank: true,
      type: true,
      firmId: true,
      createdAt: true,
      updatedAt: true,
      firm: {
        select: {
          id: true,
          title: true,
          slug: true,
          logoUrl: true,
          offers: {
            where: { isDeleted: false, showInBanner: true },
            take: 1,
            select: {
              id: true,
              code: true,
              offerPercentage: true,
              text: true,
              textArabic: true,
              showGift: true,
              isExclusive: true,
            },
          },
        },
      },
    })
    .filter()
    .exclude()
    .execute();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best seller fetched successfully",
    ...result,
  });
});

export const BestSellerService = {
  createBestSeller,
  updateBestSeller,
  handleChangeIndexOfWeeklyBestSeller,
  handleChangeIndexOfMonthlyBestSeller,
  handleChangeIndexOfRankBestSeller,
  deleteBestSeller,
  getBestSeller,
  getAllBestSeller,
};
