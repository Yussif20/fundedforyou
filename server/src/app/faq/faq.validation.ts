import z from "zod";

const createFAQ = z.object({
  body: z.object({
    question: z.string().min(5, "Question must be at least 5 characters long"),
    questionArabic: z
      .string()
      .min(5, "Question must be at least 5 characters long"),
    answer: z.string().min(5, "Answer must be at least 5 characters long"),
    answerArabic: z
      .string()
      .min(5, "Answer must be at least 5 characters long"),
    mobileFontSize: z.number().int().min(10).max(24).optional(),
  }),
});

const createManyFAQ = z.object({
  body: z.object({
    faqs: z.array(
      z.object({
        question: z
          .string()
          .min(5, "Question must be at least 5 characters long"),
        questionArabic: z
          .string()
          .min(5, "Question must be at least 5 characters long"),
        answer: z.string().min(5, "Answer must be at least 5 characters long"),
        answerArabic: z
          .string()
          .min(5, "Answer must be at least 5 characters long"),
      })
    ),
  }),
});

const getSingleFaq = z.object({
  params: z
    .object({
      faqId: z.uuid("Invalid FAQ ID"),
    })
    .strict(),
});

const updateFAQ = z.object({
  body: z
    .object({
      question: z
        .string()
        .min(5, "Question must be at least 5 characters long")
        .optional(),
      questionArabic: z
        .string()
        .min(5, "Question must be at least 5 characters long")
        .optional(),
      answer: z
        .string()
        .min(5, "Answer must be at least 5 characters long")
        .optional(),
      answerArabic: z
        .string()
        .min(5, "Answer must be at least 5 characters long")
        .optional(),
      mobileFontSize: z.number().int().min(10).max(24).optional(),
    })
    .strict(),
});

const deleteFAQ = z.object({
  params: z.object({
    faqId: z.uuid("Invalid FAQ ID"),
  }),
});

const changeIndex = z.object({
  body: z.object({
    index: z.number(),
  }),
});

export const FAQValidation = {
  createFAQ,
  createManyFAQ,
  updateFAQ,
  deleteFAQ,
  getSingleFaq,
  changeIndex
};

export type CreateFAQInput = z.infer<typeof createFAQ>;
export type CreateManyFAQInput = z.infer<typeof createManyFAQ>;
export type UpdateFAQInput = z.infer<typeof updateFAQ>;
