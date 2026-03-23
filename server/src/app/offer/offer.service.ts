import { prisma } from "@/db";
import QueryBuilder from "@/helpers/prisma/query-builder";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { Offer } from "@prisma/client";
import httpStatus from "http-status";

/** Clear timer override fields for offers whose endDate has passed */
const clearExpiredTimerFields = async () => {
  await prisma.offer.updateMany({
    where: {
      endDate: { not: null, lte: new Date() },
      isDeleted: false,
    },
    data: {
      endDate: null,
      timerCode: null,
      timerOfferPercentage: null,
      timerDiscountType: null,
      timerDiscountText: null,
      timerDiscountTextArabic: null,
      timerText: null,
      timerTextArabic: null,
    },
  });
};

const createOffer = catchAsync(async (req, res) => {
  const data: Offer = req.body;
  await prisma.firm.findUniqueOrThrow({
    where: {
      id: data.firmId,
      isDeleted: false,
    },
    select: { id: true },
  });

  if (data.showInBanner) {
    await prisma.offer.updateMany({
      where: { firmId: data.firmId, isDeleted: false, showInBanner: true },
      data: { showInBanner: false },
    });
  }

  const result = await prisma.offer.create({
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Offer created successfully",
    data: result,
  });
});

const updateOffer = catchAsync(async (req, res) => {
  const data: Offer = req.body;
  const id = req.params.id;
  if (data.firmId) {
    await prisma.firm.findUniqueOrThrow({
      where: {
        id: data.firmId,
        isDeleted: false,
      },
      select: { id: true },
    });
  }

  if (data.showInBanner) {
    const existing = await prisma.offer.findUniqueOrThrow({
      where: { id, isDeleted: false },
      select: { firmId: true },
    });
    await prisma.offer.updateMany({
      where: {
        firmId: data.firmId || existing.firmId,
        isDeleted: false,
        showInBanner: true,
        id: { not: id },
      },
      data: { showInBanner: false },
    });
  }

  const result = await prisma.offer.update({
    where: {
      id: id,
      isDeleted: false,
    },
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Offer updated successfully",
    data: result,
  });
});

const deleteOffer = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await prisma.offer.update({
    where: { id },
    data: { isDeleted: true },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Offer deleted successfully",
    data: result,
  });
});

const getSingleOffer = catchAsync(async (req, res) => {
  const id = req.params.id;
  const isAdmin = (req as any).user?.role === "SUPER_ADMIN";
  const result = await prisma.offer.findUniqueOrThrow({
    where: { id, isDeleted: false, ...(!isAdmin && { hidden: false }) },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Offer fetched successfully",
    data: result,
  });
});

const getOffersByFirmId = catchAsync(async (req, res) => {
  await clearExpiredTimerFields();
  const id = req.params.id;
  const isAdmin = (req as any).user?.role === "SUPER_ADMIN";
  const result = await prisma.firm.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      title: true,
      slug: true,

      logoUrl: true,
      affiliateLink: true,

      offers: {
        where: {
          isDeleted: false,
          ...(!isAdmin && { hidden: false }),
        },
      },
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Offers fetched successfully",
    data: result,
  });
});

const getAllOffersByFirm = catchAsync(async (req, res) => {
  await clearExpiredTimerFields();
  const query: Record<string, any> = req.query;
  const isAdmin = (req as any).user?.role === "SUPER_ADMIN";
  query.offers = {
    some: {},
  };
  const isExclusive = query?.isExclusive === "true";
  const now = new Date();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const createdAt = {
    gte: startOfMonth,
    lte: endOfMonth,
  };
  const isCurrentMonth = query?.isCurrentMonth === "true";
  delete query.isExclusive;
  delete query.isCurrentMonth;
  query.offers.some.isDeleted = false;
  if (!isAdmin) {
    query.offers.some.hidden = false;
  }
  if (isExclusive) {
    query.offers.some.isExclusive = true;
  }
  if (isCurrentMonth) {
    query.offers.some.createdAt = createdAt;
  }
  query.isDeleted = false;
  if (!query.sort) query.sort = "index";

  const offerQuery = new QueryBuilder(prisma.firm, query);
  const result = await offerQuery
    .search(["title"])
    .sort()
    .paginate()
    .customFields({
      id: true,
      title: true,
      slug: true,
      logoUrl: true,
      affiliateLink: true,
      index: true,
      offers: {
        where: {
          isDeleted: false,
          ...(!isAdmin && { hidden: false }),
          ...(isExclusive && { isExclusive }),
          ...(isCurrentMonth && { createdAt }),
        },
        select: {
          code: true,
          createdAt: true,
          showGift: true,
          isExclusive: true,
          text: true,
          textArabic: true,
          id: true,
          giftText: true,
          giftTextArabic: true,
          offerPercentage: true,
          discountType: true,
          discountText: true,
          discountTextArabic: true,
          firmId: true,
          endDate: true,
          hidden: true,
          showInBanner: true,
          timerCode: true,
          timerOfferPercentage: true,
          timerDiscountType: true,
          timerDiscountText: true,
          timerDiscountTextArabic: true,
          timerText: true,
          timerTextArabic: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    })
    .filter()
    .exclude()
    .execute();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Offers fetched successfully",
    ...result,
  });
});

const getAllOffers = catchAsync(async (req, res) => {
  await clearExpiredTimerFields();
  const query: Record<string, any> = req.query;
  const isAdmin = (req as any).user?.role === "SUPER_ADMIN";

  const isExclusive = query?.isExclusive === "true";
  const now = new Date();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const createdAt = {
    gte: startOfMonth,
    lte: endOfMonth,
  };
  const isCurrentMonth = query?.isCurrentMonth === "true";
  delete query.isExclusive;
  delete query.isCurrentMonth;
  query.isDeleted = false;
  if (!isAdmin) {
    query.hidden = false;
  }
  if (isCurrentMonth) {
    query.createdAt = createdAt;
  }
  if (isExclusive) {
    query.isExclusive = true;
  }
  if (query.firmType !== undefined) {
    query.firm = { ...query.firm, firmType: query.firmType };
    delete query.firmType;
  }

  const offerQuery = new QueryBuilder(prisma.offer, query);
  const result = await offerQuery
    .search(["code"])
    .sort()
    .paginate()
    .customFields({
      id: true,
      code: true,
      createdAt: true,
      showGift: true,
      isExclusive: true,
      giftText: true,
      giftTextArabic: true,
      text: true,
      textArabic: true,
      offerPercentage: true,
      discountType: true,
      discountText: true,
      discountTextArabic: true,
      firmId: true,
      endDate: true,
      hidden: true,
      showInBanner: true,
      timerCode: true,
      timerOfferPercentage: true,
      timerDiscountType: true,
      timerDiscountText: true,
      timerDiscountTextArabic: true,
      timerText: true,
      timerTextArabic: true,
      firm: {
        select: {
          logoUrl: true,
          title: true,
          slug: true,
          affiliateLink: true,
        },
      },
    })
    .filter()
    .exclude()
    .execute();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Offers fetched successfully",
    ...result,
  });
});

export const OfferService = {
  createOffer,
  updateOffer,
  deleteOffer,
  getSingleOffer,
  getOffersByFirmId,
  getAllOffersByFirm,
  getAllOffers,
};
