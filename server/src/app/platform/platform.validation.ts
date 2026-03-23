import z from "zod";

const createPlatform = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required"),
    })
    .strict(),
});

const updatePlatform = z.object({
  params: z
    .object({
      platformId: z.uuid("Invalid platform ID"),
    })
    .strict(),
  body: z
    .object({
      title: z.string().min(1, "Title is required").optional(),
    })
    .strict(),
});

const deletePlatform = z.object({
  params: z
    .object({
      platformId: z.uuid("Invalid platform ID"),
    })
    .strict(),
});

const getSinglePlatform = z.object({
  params: z
    .object({
      platformId: z.uuid("Invalid platform ID"),
    })
    .strict(),
});

export const PlatformValidation = {
  createPlatform,
  updatePlatform,
  deletePlatform,
  getSinglePlatform,
};

// types
export type CreatePlatformInput = z.infer<typeof createPlatform>;
export type UpdatePlatformInput = z.infer<typeof updatePlatform>;
export type DeletePlatformInput = z.infer<typeof deletePlatform>;
