import { prisma } from "@/db";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";

const createNews = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await prisma.news.create({
    data: payload,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News created successfully",
    data: result,
  });
});

const updateNews = catchAsync(async (req, res) => {
  const { newsId } = req.params;
  const payload = req.body;
  const result = await prisma.news.update({
    where: { id: newsId },
    data: payload,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News updated successfully",
    data: result,
  });
});

const deleteNews = catchAsync(async (req, res) => {
  const { newsId } = req.params;
  const result = await prisma.news.delete({
    where: { id: newsId },
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News deleted successfully",
    data: result,
  });
});

const getAllNews = catchAsync(async (req, res) => {
  const tab: "current" | "previous" | "next" | undefined =
    (req.query.tab as "current" | "previous" | "next" | undefined) || "current";

  const now = new Date();
  let lteDate = new Date();
  let gteDate = new Date();

  // Calculate the start of the current week (assuming week starts on Sunday)
  const currentDayOfWeek = now.getDay();
  const startOfCurrentWeek = new Date(now);
  startOfCurrentWeek.setDate(now.getDate() - currentDayOfWeek);
  startOfCurrentWeek.setHours(0, 0, 0, 0); // 12:00 AM

  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);
  endOfCurrentWeek.setHours(23, 59, 59, 999); // 11:59 PM

  // Set date ranges based on tab
  switch (tab) {
    case "current":
      gteDate = startOfCurrentWeek; // Sunday 12:00 AM
      lteDate = endOfCurrentWeek; // Saturday 11:59 PM
      break;

    case "previous":
      gteDate = new Date(startOfCurrentWeek);
      gteDate.setDate(startOfCurrentWeek.getDate() - 7);
      gteDate.setHours(0, 0, 0, 0); // Previous Sunday 12:00 AM

      lteDate = new Date(startOfCurrentWeek);
      lteDate.setDate(startOfCurrentWeek.getDate() - 1);
      lteDate.setHours(23, 59, 59, 999); // Previous Saturday 11:59 PM
      break;

    case "next":
      gteDate = new Date(endOfCurrentWeek);
      gteDate.setDate(endOfCurrentWeek.getDate() + 1);
      gteDate.setHours(0, 0, 0, 0); // Next Sunday 12:00 AM

      lteDate = new Date(gteDate);
      lteDate.setDate(gteDate.getDate() + 6);
      lteDate.setHours(23, 59, 59, 999); // Next Saturday 11:59 PM
      break;

    default:
      gteDate = startOfCurrentWeek;
      lteDate = endOfCurrentWeek;
  }

  const result = await prisma.news.findMany({
    where: {
      dateAndTime: {
        gte: gteDate,
        lte: lteDate,
      },
    },
    orderBy: [
      { order: "asc" },
      { dateAndTime: "asc" },
    ],
  });

  const grouped = result.reduce(
    (acc, news) => {
      const newsDate = new Date(news.dateAndTime);
      const dateKey = newsDate.toISOString().split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(news);

      return acc;
    },
    {} as Record<string, typeof result>,
  );

  const groupByDay = Object.entries(grouped)
    .map(([date, news]) => ({ date, news }))
    .sort((a, b) => a.date.localeCompare(b.date));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News retrieved successfully",
    data: groupByDay,
  });
});

const reorderNews = catchAsync(async (req, res) => {
  const { news } = req.body;

  if (!news || !Array.isArray(news)) {
    throw new Error("Invalid news data");
  }

  // Update order for each news item using updateMany to avoid errors if record doesn't exist
  await prisma.$transaction(
    news.map((item: { id: string; order: number }) =>
      prisma.news.updateMany({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News reordered successfully",
  });
});

const changeIndexOfNews = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { targetId } = req.body;

  if (!targetId) {
    throw new Error("targetId is required");
  }

  await prisma.$transaction(async (tx) => {
    const [itemA, itemB] = await Promise.all([
      tx.news.findUnique({ where: { id }, select: { id: true, order: true } }),
      tx.news.findUnique({ where: { id: targetId }, select: { id: true, order: true } }),
    ]);

    if (!itemA || !itemB) {
      throw new Error("News item not found");
    }

    let orderA = itemA.order ?? 0;
    let orderB = itemB.order ?? 0;

    // If both have the same order, assign distinct values so the swap is visible
    if (orderA === orderB) {
      orderA = 0;
      orderB = 1;
    }

    // Swap their order values
    await tx.news.update({ where: { id: itemA.id }, data: { order: orderB } });
    await tx.news.update({ where: { id: itemB.id }, data: { order: orderA } });
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News order changed successfully",
  });
});

export const NewsService = {
  createNews,
  updateNews,
  deleteNews,
  getAllNews,
  reorderNews,
  changeIndexOfNews,
};
