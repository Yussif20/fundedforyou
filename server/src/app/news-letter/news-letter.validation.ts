import z from "zod";

const subscribe = z.object({
  body: z
    .object({
      email: z.email(),
    })
    .strict(),
});

export const NewsLetterValidation = { subscribe };
