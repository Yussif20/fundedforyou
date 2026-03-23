import z from "zod";

const createAnnouncement = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(4),
    date: z.string(),
    redirectUrl: z.url().optional(),
    firmId: z.string(),
    mobileFontSize: z.number().int().min(10).max(24).optional(),
  }),
});

const updateAnnouncement = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(4),
    date: z.string(),
    redirectUrl: z.url().optional(),
    mobileFontSize: z.number().int().min(10).max(24).optional(),
  }),
  params: z.object({
    announcementId: z.uuid(),
  }),
});

export const AnnouncementsValidation = {
  createAnnouncement,
  updateAnnouncement,
};

export type CreateAnnouncementInput = z.infer<typeof createAnnouncement>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncement>;
