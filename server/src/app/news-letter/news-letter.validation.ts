import z from "zod";

const subscribe = z.object({
  body: z
    .object({
      email: z.email(),
    })
    .strict(),
});

const deleteSubscriber = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

const sendBulkEmail = z.object({
  body: z
    .object({
      subject: z.string().min(1).max(200),
      body: z.string().min(1).max(10000),
    })
    .strict(),
});

export const NewsLetterValidation = { subscribe, deleteSubscriber, sendBulkEmail };
