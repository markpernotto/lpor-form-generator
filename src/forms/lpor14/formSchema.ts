import { z } from "zod";

export const lporFormSchema = z.object({
  // Header Section - Required fields
  courtName: z
    .string()
    .min(1, "Court name is required"),
  docketNumber: z
    .string()
    .min(1, "Docket number is required"),
  division: z
    .string()
    .min(1, "Division is required"),
  filedDate: z
    .string()
    .min(1, "Filed date is required"),
  clerk: z
    .string()
    .min(1, "Clerk name is required"),

  // Order Type - Required
  orderType: z.enum(["modify", "dissolve"], {
    message:
      "Please select whether to modify or dissolve the order",
  }),

  // Petitioner Information - Required fields
  petitioner: z.object({
    firstName: z
      .string()
      .min(1, "First name is required"),
    maidenMiddleName: z.string().optional(),
    lastName: z
      .string()
      .min(1, "Last name is required"),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required"),
    sex: z.enum(["F", "M"], {
      message: "Sex is required",
    }),
    race: z.string().min(1, "Race is required"),
    protectedPersonType: z.enum(
      ["petitioner", "others"],
      {
        message:
          "Protected person type is required",
      },
    ),
    otherProtectedPersons: z.string().optional(),
  }),

  // Defendant Information - Required fields
  defendant: z.object({
    fullName: z
      .string()
      .min(1, "Defendant full name is required"),
    alias: z.string().optional(),
    dateOfBirth: z
      .string()
      .min(
        1,
        "Defendant date of birth is required",
      ),
    sex: z.enum(["F", "M"], {
      message: "Defendant sex is required",
    }),
    race: z
      .string()
      .min(1, "Defendant race is required"),
    address: z.object({
      street: z
        .string()
        .min(1, "Street address is required"),
      aptNumber: z.string().optional(),
      city: z.string().min(1, "City is required"),
      state: z
        .string()
        .min(1, "State is required"),
      zipCode: z
        .string()
        .min(1, "Zip code is required"),
    }),
    socialSecurityNumber: z.string().optional(),
    driversLicense: z
      .object({
        number: z.string().optional(),
        state: z.string().optional(),
        expiration: z.string().optional(),
      })
      .optional(),
  }),

  // Order Details - At least one section must be selected
  orderDetails: z.object({
    section1: z
      .object({
        isSelected: z.boolean(),
        originalOrderType: z
          .array(
            z.enum([
              "tro",
              "preliminary",
              "permanent",
            ]),
          )
          .optional(),
        originalOrderDate: z.string().optional(),
        originalOrderLegalBasis: z
          .array(
            z.enum(["rs372", "rs361", "ccp3601"]),
          )
          .optional(),
      })
      .optional(),
    section2: z
      .object({
        isSelected: z.boolean(),
        originalOrderType: z
          .array(
            z.enum([
              "tro",
              "preliminary",
              "permanent",
            ]),
          )
          .optional(),
        originalOrderDate: z.string().optional(),
        originalOrderLegalBasis: z
          .array(
            z.enum(["rs372", "rs361", "ccp3601"]),
          )
          .optional(),
      })
      .optional(),
    section3: z
      .object({
        isSelected: z.boolean(),
      })
      .optional(),
  }),

  // Signature Section - Optional (court will fill)
  signatures: z.object({
    dateOfOrder: z.string().optional(),
    judgeName: z.string().optional(),
  }),

  // Service Information
  serviceInfo: z.object({
    defendantServedAtHearing: z.boolean(),
    serviceDate: z.string().optional(),
    serviceClerk: z.string().optional(),
    faxedToRegistry: z.boolean(),
    transmissionDate: z.string().optional(),
    transmissionClerk: z.string().optional(),
  }),

  // Administrative
  administrative: z.object({
    pnoNumber: z.string().optional(),
    dateEntered: z.string().optional(),
    initials: z.string().optional(),
    verifiedBy: z.string().optional(),
  }),
});
// Removed validation rule for order details since those are court-only sections

export type LPORFormSchema = z.infer<
  typeof lporFormSchema
>;
