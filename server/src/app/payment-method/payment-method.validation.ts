import z from "zod";

const createPaymentMethod = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required"),
    })
    .strict(),
});

const updatePaymentMethod = z.object({
  params: z
    .object({
      paymentMethodId: z.uuid("Invalid paymentMethod ID"),
    })
    .strict(),
  body: z
    .object({
      title: z.string().min(1, "Title is required").optional(),
    })
    .strict(),
});

const deletePaymentMethod = z.object({
  params: z
    .object({
      paymentMethodId: z.uuid("Invalid paymentMethod ID"),
    })
    .strict(),
});

const getSinglePaymentMethod = z.object({
  params: z
    .object({
      paymentMethodId: z.uuid("Invalid paymentMethod ID"),
    })
    .strict(),
});

export const PaymentMethodValidation = {
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getSinglePaymentMethod,
};

// types
export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethod>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethod>;
export type DeletePaymentMethodInput = z.infer<typeof deletePaymentMethod>;
