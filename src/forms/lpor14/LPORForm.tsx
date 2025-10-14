import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  lporFormSchema,
  type LPORFormSchema,
} from "./formSchema";

interface LPORFormProps {
  onSubmit: (data: LPORFormSchema) => void;
}

export const LPORForm: React.FC<
  LPORFormProps
> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LPORFormSchema>({
    resolver: zodResolver(lporFormSchema),
    defaultValues: {
      orderType: undefined,
      petitioner: {
        sex: undefined,
        protectedPersonType: undefined,
      },
      defendant: {
        sex: undefined,
        address: {},
        driversLicense: {},
      },
      orderDetails: {
        section1: { isSelected: false },
        section2: { isSelected: false },
        section3: { isSelected: false },
      },
      serviceInfo: {
        defendantServedAtHearing: false,
        faxedToRegistry: false,
      },
      administrative: {},
    },
  });

  const watchProtectedPersonType = watch(
    "petitioner.protectedPersonType",
  );
  // Removed unused watch variables for commented-out sections

  const loadTestData = () => {
    // Pre-fill form with test data for quick testing
    const testData = {
      courtName:
        "19th Judicial District Court, East Baton Rouge Parish",
      docketNumber: "2024-CV-12345",
      division: "B",
      filedDate: "2024-10-13",
      clerk: "Jane Smith",
      orderType: "modify" as const,
      petitioner: {
        firstName: "Mary",
        maidenMiddleName: "Elizabeth",
        lastName: "Johnson",
        dateOfBirth: "1985-06-15",
        sex: "F" as const,
        race: "White",
        protectedPersonType:
          "petitioner" as const,
        otherProtectedPersons: "",
      },
      defendant: {
        fullName: "Robert Michael Johnson",
        alias: "Bobby Johnson",
        dateOfBirth: "1982-03-22",
        sex: "M" as const,
        race: "White",
        address: {
          street: "1234 Main Street",
          aptNumber: "Apt 2B",
          city: "Baton Rouge",
          state: "Louisiana",
          zipCode: "70802",
        },
        socialSecurityNumber: "123-45-6789",
        driversLicense: {
          number: "D12345678",
          state: "LA",
          expiration: "2025-12-31",
        },
      },
      orderDetails: {
        section1: { isSelected: false },
        section2: { isSelected: false },
        section3: { isSelected: false },
      },
      serviceInfo: {
        defendantServedAtHearing: false,
        faxedToRegistry: false,
      },
      signatures: {
        dateOfOrder: "",
        judgeName: "",
      },
      administrative: {},
    };

    // Reset form and load test data
    reset(testData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Louisiana Uniform Abuse Prevention Order
        </h1>
        <h2 className="text-lg text-center mb-4">
          Order to Modify or Dissolve a Prior
          Louisiana Uniform Abuse Prevention Order
        </h2>
        <p className="text-sm text-center text-gray-600">
          LPOR 14 - v.8 | Pursuant to La. R.S.
          9:372, La. R.S. 9:361 et seq. or La.
          C.C.P. Art. 3601 et seq.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Header Section */}
        <section className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Court Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Court Name and Parish/City *
              </label>
              <input
                {...register("courtName")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter court name and parish/city"
              />
              {errors.courtName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.courtName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Docket Number *
              </label>
              <input
                {...register("docketNumber")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter docket number"
              />
              {errors.docketNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.docketNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Division *
              </label>
              <input
                {...register("division")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter division"
              />
              {errors.division && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.division.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Filed Date *
              </label>
              <input
                {...register("filedDate")}
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.filedDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.filedDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Clerk *
              </label>
              <input
                {...register("clerk")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter clerk name"
              />
              {errors.clerk && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.clerk.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Order Type */}
        <section className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Order Type *
          </h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                {...register("orderType")}
                type="radio"
                value="modify"
                className="mr-2"
              />
              <span className="font-medium">
                MODIFY
              </span>{" "}
              - Modify a prior Louisiana Uniform
              Abuse Prevention Order
            </label>
            <label className="flex items-center">
              <input
                {...register("orderType")}
                type="radio"
                value="dissolve"
                className="mr-2"
              />
              <span className="font-medium">
                DISSOLVE
              </span>{" "}
              - Dissolve a prior Louisiana Uniform
              Abuse Prevention Order
            </label>
          </div>
          {errors.orderType && (
            <p className="text-red-500 text-sm mt-2">
              {errors.orderType.message}
            </p>
          )}
        </section>

        {/* Petitioner Information */}
        <section className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Petitioner Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <input
                {...register(
                  "petitioner.firstName",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="First name"
              />
              {errors.petitioner?.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.petitioner.firstName
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Maiden/Middle Name
              </label>
              <input
                {...register(
                  "petitioner.maidenMiddleName",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Maiden/Middle name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <input
                {...register(
                  "petitioner.lastName",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Last name"
              />
              {errors.petitioner?.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.petitioner.lastName
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth *
              </label>
              <input
                {...register(
                  "petitioner.dateOfBirth",
                )}
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.petitioner?.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.petitioner.dateOfBirth
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sex *
              </label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    {...register(
                      "petitioner.sex",
                    )}
                    type="radio"
                    value="F"
                    className="mr-1"
                  />
                  Female
                </label>
                <label className="flex items-center">
                  <input
                    {...register(
                      "petitioner.sex",
                    )}
                    type="radio"
                    value="M"
                    className="mr-1"
                  />
                  Male
                </label>
              </div>
              {errors.petitioner?.sex && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.petitioner.sex.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Race *
              </label>
              <input
                {...register("petitioner.race")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Race"
              />
              {errors.petitioner?.race && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.petitioner.race.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Protected Person is: *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  {...register(
                    "petitioner.protectedPersonType",
                  )}
                  type="radio"
                  value="petitioner"
                  className="mr-2"
                />
                Petitioner
              </label>
              <label className="flex items-center">
                <input
                  {...register(
                    "petitioner.protectedPersonType",
                  )}
                  type="radio"
                  value="others"
                  className="mr-2"
                />
                Other(s)
              </label>
            </div>
            {errors.petitioner
              ?.protectedPersonType && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors.petitioner
                    .protectedPersonType.message
                }
              </p>
            )}

            {watchProtectedPersonType ===
              "others" && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  List other(s) name & date of
                  birth:
                </label>
                <textarea
                  {...register(
                    "petitioner.otherProtectedPersons",
                  )}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  placeholder="Enter names and dates of birth of other protected persons"
                />
              </div>
            )}
          </div>
        </section>

        {/* Defendant Information */}
        <section className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Defendant Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                {...register(
                  "defendant.fullName",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Defendant's full name"
              />
              {errors.defendant?.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.defendant.fullName
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Alias
              </label>
              <input
                {...register("defendant.alias")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Alias (if any)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth *
              </label>
              <input
                {...register(
                  "defendant.dateOfBirth",
                )}
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.defendant?.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.defendant.dateOfBirth
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sex *
              </label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    {...register("defendant.sex")}
                    type="radio"
                    value="F"
                    className="mr-1"
                  />
                  Female
                </label>
                <label className="flex items-center">
                  <input
                    {...register("defendant.sex")}
                    type="radio"
                    value="M"
                    className="mr-1"
                  />
                  Male
                </label>
              </div>
              {errors.defendant?.sex && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.defendant.sex.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Race *
              </label>
              <input
                {...register("defendant.race")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Race"
              />
              {errors.defendant?.race && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.defendant.race.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">
              Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Street Address *
                </label>
                <input
                  {...register(
                    "defendant.address.street",
                  )}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Street address"
                />
                {errors.defendant?.address
                  ?.street && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors.defendant.address
                        .street.message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Apartment Number
                </label>
                <input
                  {...register(
                    "defendant.address.aptNumber",
                  )}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Apt #"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  City *
                </label>
                <input
                  {...register(
                    "defendant.address.city",
                  )}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="City"
                />
                {errors.defendant?.address
                  ?.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors.defendant.address
                        .city.message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  State *
                </label>
                <input
                  {...register(
                    "defendant.address.state",
                  )}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="State"
                />
                {errors.defendant?.address
                  ?.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors.defendant.address
                        .state.message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Zip Code *
                </label>
                <input
                  {...register(
                    "defendant.address.zipCode",
                  )}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Zip code"
                />
                {errors.defendant?.address
                  ?.zipCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors.defendant.address
                        .zipCode.message
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Social Security Number
              </label>
              <input
                {...register(
                  "defendant.socialSecurityNumber",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="SSN (optional)"
              />
            </div>
          </div>

          {/* Driver's License */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">
              Driver's License (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  License Number
                </label>
                <input
                  {...register(
                    "defendant.driversLicense.number",
                  )}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="License number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  State
                </label>
                <input
                  {...register(
                    "defendant.driversLicense.state",
                  )}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Expiration Date
                </label>
                <input
                  {...register(
                    "defendant.driversLicense.expiration",
                  )}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Order Details */}
        {/* <section className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Order Details
          </h3>
          <div className="bg-yellow-50 p-3 rounded mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> At least one
              section must be selected.
            </p>
          </div> */}

        {/* Section 1: Modify Order */}
        {/* <div className="border border-gray-200 p-4 rounded mb-4"> */}
        {/* <label className="flex items-start">
              <input
                {...register(
                  "orderDetails.section1.isSelected",
                )}
                type="checkbox"
                className="mr-3 mt-1"
              />
              <div>
                <strong>
                  Section 1: Modification Order
                </strong>
                <p className="text-sm text-gray-600 mt-1">
                  IT IS HEREBY ORDERED, ADJUDGED,
                  and DECREED that the Louisiana
                  Uniform Abuse Prevention Order
                  is hereby modified
                </p>
              </div>
            </label> */}

        {/* {watchSection1 && (
              <div className="mt-4 ml-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Original Order Type (check all
                    that apply):
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section1.originalOrderType",
                        )}
                        type="checkbox"
                        value="tro"
                        className="mr-2"
                      />
                      Temporary Restraining Order
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section1.originalOrderType",
                        )}
                        type="checkbox"
                        value="preliminary"
                        className="mr-2"
                      />
                      Preliminary Injunction
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section1.originalOrderType",
                        )}
                        type="checkbox"
                        value="permanent"
                        className="mr-2"
                      />
                      Permanent Injunction
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Original Order Date:
                  </label>
                  <input
                    {...register(
                      "orderDetails.section1.originalOrderDate",
                    )}
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Original Order Legal Basis
                    (check all that apply):
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section1.originalOrderLegalBasis",
                        )}
                        type="checkbox"
                        value="rs372"
                        className="mr-2"
                      />
                      La. R.S. 9:372
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section1.originalOrderLegalBasis",
                        )}
                        type="checkbox"
                        value="rs361"
                        className="mr-2"
                      />
                      La. R.S. 9:361 et seq.
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section1.originalOrderLegalBasis",
                        )}
                        type="checkbox"
                        value="ccp3601"
                        className="mr-2"
                      />
                      La. C.C.P. Art. 3601 et seq.
                    </label>
                  </div>
                </div>
              </div>
            )} */}
        {/* </div> */}

        {/* Section 2: Dissolve Order */}
        {/* <div className="border border-gray-200 p-4 rounded mb-4"> */}
        {/* <label className="flex items-start">
              <input
                {...register(
                  "orderDetails.section2.isSelected",
                )}
                type="checkbox"
                className="mr-3 mt-1"
              />
              <div>
                <strong>
                  Section 2: Dissolution Order
                </strong>
                <p className="text-sm text-gray-600 mt-1">
                  IT IS HEREBY ORDERED, ADJUDGED,
                  AND DECREED that the Louisiana
                  Uniform Abuse Prevention Order
                  is hereby dissolved
                </p>
              </div>
            </label> */}

        {/* {watchSection2 && (
              <div className="mt-4 ml-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Original Order Type (check all
                    that apply):
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section2.originalOrderType",
                        )}
                        type="checkbox"
                        value="tro"
                        className="mr-2"
                      />
                      Temporary Restraining Order
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section2.originalOrderType",
                        )}
                        type="checkbox"
                        value="preliminary"
                        className="mr-2"
                      />
                      Preliminary Injunction
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section2.originalOrderType",
                        )}
                        type="checkbox"
                        value="permanent"
                        className="mr-2"
                      />
                      Permanent Injunction
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Original Order Date:
                  </label>
                  <input
                    {...register(
                      "orderDetails.section2.originalOrderDate",
                    )}
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Original Order Legal Basis
                    (check all that apply):
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section2.originalOrderLegalBasis",
                        )}
                        type="checkbox"
                        value="rs372"
                        className="mr-2"
                      />
                      La. R.S. 9:372
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section2.originalOrderLegalBasis",
                        )}
                        type="checkbox"
                        value="rs361"
                        className="mr-2"
                      />
                      La. R.S. 9:361 et seq.
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register(
                          "orderDetails.section2.originalOrderLegalBasis",
                        )}
                        type="checkbox"
                        value="ccp3601"
                        className="mr-2"
                      />
                      La. C.C.P. Art. 3601 et seq.
                    </label>
                  </div>
                </div>
              </div>
            )} */}
        {/* </div> */}

        {/* Section 3: Court Costs */}
        {/* <div className="border border-gray-200 p-4 rounded"> */}
        {/* <label className="flex items-start">
              <input
                {...register(
                  "orderDetails.section3.isSelected",
                )}
                type="checkbox"
                className="mr-3 mt-1"
              />
              <div>
                <strong>
                  Section 3: Court Costs
                </strong>
                <p className="text-sm text-gray-600 mt-1">
                  THE COURT ORDERS THE DEFENDANT
                  to pay all court costs
                </p>
              </div>
            </label>
          </div> */}

        {/* {errors.orderDetails && (
            <p className="text-red-500 text-sm mt-2">
              {errors.orderDetails.message}
            </p>
          )} */}
        {/* </section> */}

        {/* Signature Section */}
        {/* <section className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Signature Section
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Order *
              </label>
              <input
                {...register(
                  "signatures.dateOfOrder",
                )}
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.signatures?.dateOfOrder && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.signatures.dateOfOrder
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Judge Name (Print or Stamp) *
              </label>
              <input
                {...register(
                  "signatures.judgeName",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Judge's name"
              />
              {errors.signatures?.judgeName && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.signatures.judgeName
                      .message
                  }
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Signature
              fields will be left blank on the
              generated PDF for manual completion
              by the judge, petitioner, and
              defendant.
            </p>
          </div>
        </section> */}

        {/* Service Information */}
        {/* <section className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Service Information
          </h3>

          <div className="space-y-4">
            <label className="flex items-start">
              <input
                {...register(
                  "serviceInfo.defendantServedAtHearing",
                )}
                type="checkbox"
                className="mr-3 mt-1"
              />
              <span>
                DEFENDANT WAS SERVED AT CLOSE OF
                HEARING
              </span>
            </label>

            {watchDefendantServed && (
              <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Service Date
                  </label>
                  <input
                    {...register(
                      "serviceInfo.serviceDate",
                    )}
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Service Clerk
                  </label>
                  <input
                    {...register(
                      "serviceInfo.serviceClerk",
                    )}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Clerk name"
                  />
                </div>
              </div>
            )}

            <label className="flex items-start">
              <input
                {...register(
                  "serviceInfo.faxedToRegistry",
                )}
                type="checkbox"
                className="mr-3 mt-1"
              />
              <span>
                FAXED OR ELECTRONICALLY
                TRANSMITTED TO LOUISIANA
                PROTECTIVE ORDER REGISTRY
              </span>
            </label>

            {watchFaxedToRegistry && (
              <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Transmission Date
                  </label>
                  <input
                    {...register(
                      "serviceInfo.transmissionDate",
                    )}
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Transmission Clerk
                  </label>
                  <input
                    {...register(
                      "serviceInfo.transmissionClerk",
                    )}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Clerk name"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Distribution:</strong>{" "}
              Copies to: (1) Court file (2)
              Petitioner/protected person(s) (3)
              Defendant (4) Chief Law Enforcement
              Official of the parish where the
              protected person(s) resides (5)
              Louisiana Protective Order Registry.
            </p>
          </div>
        </section> */}

        {/* Administrative Section */}
        {/* <section className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Administrative Section (For LPOR Use
            Only)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                PNO Number
              </label>
              <input
                {...register(
                  "administrative.pnoNumber",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="PNO#"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date Entered
              </label>
              <input
                {...register(
                  "administrative.dateEntered",
                )}
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Initials
              </label>
              <input
                {...register(
                  "administrative.initials",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Initials"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Verified By
              </label>
              <input
                {...register(
                  "administrative.verifiedBy",
                )}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Verified by"
              />
            </div>
          </div>
        </section> */}

        {/* Form Actions */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={loadTestData}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Load Test Data
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Clear Form
            </button>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Generate PDF
          </button>
        </div>
      </form>
    </div>
  );
};
