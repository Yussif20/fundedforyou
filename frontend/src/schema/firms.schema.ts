import z from "zod";

export const FirmTypeEnum = {
  FOREX: "FOREX",
  FUTURES: "FUTURES",
};

export type FirmType_T = keyof typeof FirmTypeEnum;

export const StepsEnum = {
  STEP1: "STEP1",
  STEP2: "STEP2",
  STEP3: "STEP3",
  STEP4: "STEP4",
  INSTANT: "INSTANT",
};

const stringArray = (fieldName: string) =>
  z.array(
    z
      .string(`${fieldName} cannot be empty`)
      .min(1, `${fieldName} cannot be empty`)
  );

const LeverageSchema = z.array(
  z.object({
    asset: z.string("Asset cannot be empty").min(1, "Asset cannot be empty"),
    instantLeverage: z
      .number("Instant leverage is required")
      .int("Instant leverage must be an integer")
      .min(0)
      .optional(),
    firstStepLeverage: z
      .number("First step leverage is required")
      .int("First step leverage must be an integer")
      .min(0)
      .optional(),
    secondStepLeverage: z
      .number("Second step leverage is required")
      .int("Second step leverage must be an integer")
      .min(0)
      .optional(),
    thirdStepLeverage: z
      .number("Third step leverage is required")
      .int("Third step leverage must be an integer")
      .min(0)
      .optional(),
  })
);

const createFirm = z
  .object({
    firmType: z.enum(FirmTypeEnum),
    title: z.string("Title is required").min(1, "Title cannot be empty"),
    yearsInOperation: z
      .number("Years in operation is required")
      .int("Years in operation must be an integer")
      .min(0, "Years in operation cannot be negative"),
    dateEstablished: z.coerce.date().optional(),
    ceo: z
      .string("CEO name cannot be empty")
      .min(1, "CEO name cannot be empty")
      .optional(),
    hidden: z.boolean().optional(),
    brokers: stringArray("Broker"),
    platforms: stringArray("Platform"),
    paymentMethods: stringArray("Payment method"),
    payoutMethods: stringArray("Payout method"),
    restrictedCountries: stringArray("Restricted country"),
    countries: stringArray("Country"),
    typeOfInstruments: stringArray("Instrument type"),
    commissions: stringArray("Commission"),
    offers: stringArray("Offer"),
    affiliateLink: z
      .string("Affiliate link cannot be empty")
      .min(1, "Affiliate link cannot be empty"),
    maxAllocation: z
      .number("Max allocation cannot be empty")
      .min(1, "Max allocation cannot be empty"),
    country: z
      .string("Country cannot be empty")
      .min(1, "Country cannot be empty"),
    programTypes: z.array(z.enum(StepsEnum)),
    leverage: LeverageSchema.default([]).optional(),
  })
  .strict();

export type Firm_INPUT_T = z.infer<typeof createFirm>;
