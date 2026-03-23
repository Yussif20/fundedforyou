import { ContactUsStatusEnum, ContactUsType } from "@prisma/client";
import z from "zod";

const createContactUs = z.object({
  body: z
    .object({
      contactType: z.enum(ContactUsType),
      inquiry: z.string().nonempty(),
      fullName: z.string().nonempty(),
      email: z.email(),
      message: z.string().min(6),
    })
    .strict(),
});

const deleteContactUs = z.object({
  params: z
    .object({
      contactUsId: z.uuid(),
    })
    .strict(),
});

const updateContactUsStatus = z.object({
  params: z.object({
    contactUsId: z.uuid(),
  }),
  body: z
    .object({
      status: z.enum(ContactUsStatusEnum),
    })
    .strict(),
});

export const ContactUsValidation = {
  createContactUs,
  deleteContactUs,
  updateContactUsStatus,
};

export type CreateContactUsInput = z.infer<typeof createContactUs>;
export type DeleteContactUsInput = z.infer<typeof deleteContactUs>;
export type UpdateContactUsStatusInput = z.infer<typeof updateContactUsStatus>;
