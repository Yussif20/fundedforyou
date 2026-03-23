import z from "zod";

const createBroker = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required"),
    })
    .strict(),
});

const updateBroker = z.object({
  params: z
    .object({
      brokerId: z.uuid("Invalid broker ID"),
    })
    .strict(),
  body: z
    .object({
      title: z.string().min(1, "Title is required").optional(),
    })
    .strict(),
});

const deleteBroker = z.object({
  params: z
    .object({
      brokerId: z.uuid("Invalid broker ID"),
    })
    .strict(),
});

const getSingleBroker = z.object({
  params: z
    .object({
      brokerId: z.uuid("Invalid broker ID"),
    })
    .strict(),
});

export const BrokerValidation = {
  createBroker,
  updateBroker,
  deleteBroker,
  getSingleBroker,
};

// types
export type CreateBrokerInput = z.infer<typeof createBroker>;
export type UpdateBrokerInput = z.infer<typeof updateBroker>;
export type DeleteBrokerInput = z.infer<typeof deleteBroker>;
