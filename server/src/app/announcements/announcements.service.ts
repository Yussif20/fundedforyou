import { prisma } from "@/db";
import QueryBuilder from "@/helpers/prisma/query-builder";
import { uploadToMinIO } from "@/lib/uploadFileToStorage";
import {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "./announcements.validation";

const getAllAnnouncementsForFirm = async (firmId: string, query: any) => {
  const firm = await prisma.firm.findUnique({
    where: { slug: firmId },
  });

  query.firmId = firm?.id;

  const announcementQuery = new QueryBuilder(prisma.announcements, query);

  const { data, meta } = await announcementQuery
    .search(["title", "description"])
    .filter()
    .sort()
    .paginate()
    .execute();

  return {
    announcements: data,
    meta,
  };
};

const createAnnouncement = async (
  payload: CreateAnnouncementInput["body"] & { thumbnailUrl: string },
  thumbnailFile: Express.Multer.File
) => {
  payload.thumbnailUrl = await uploadToMinIO(thumbnailFile);
  const firm = await prisma.firm.findUnique({
    where: { slug: payload.firmId },
  });

  const announcement = await prisma.announcements.create({
    data: {
      ...payload,
      firmId: firm?.id!,
    },
  });

  return { announcement };
};

const updateAnnouncement = async (
  announcementId: string,
  payload: UpdateAnnouncementInput["body"] & { thumbnailUrl?: string },
  thumbnailFile?: Express.Multer.File
) => {
  if (thumbnailFile) {
    payload.thumbnailUrl = await uploadToMinIO(thumbnailFile);
  }

  const announcement = await prisma.announcements.update({
    where: { id: announcementId },
    data: payload,
  });

  return { announcement };
};

export const AnnouncementsService = {
  createAnnouncement,
  updateAnnouncement,
  getAllAnnouncementsForFirm,
};
