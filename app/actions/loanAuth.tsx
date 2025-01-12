import { guarantorShema, guarantorState } from "../lib/definitions";
import {
  blobToFile,
  extractFormFields,
  formatZodErrors,
  getImageDimensions,
  makeRequest,
} from "../lib/utils";

export async function processLoan(state: guarantorState, formData: FormData) {
  const expectedFields = [
    "client",
    "loanProduct",
    "principal",
    "fund",
    "loanTerms",
    "repaymentFrequency",
    "type",
    "expectedDisbursementDate",
    "loanOfficer",
    "loanPurpose",
    "registrationFee",
    "advanceFee",
    "processingFee",
    "expectedFirstRepayment",
    "guarantorFullName",
    "guarantorOccupation",
    "guarantorUnionName",
    "guarantorResidence",
    "guarantorPassport",
    "guarantorFullName",
    "guarantorOccupation",
    "guarantorUnionName",
    "guarantorResidence",
    "guarantorPassport",
    "guarantorMobile",
    "interest",
    "service",
  ];

  console.log(formData.get("principal"));

  const body: any = extractFormFields(formData, expectedFields);
  let schema: any = guarantorShema; // Start with the base schema
  schema = schema.omit({ guarantorPassport: true });

  // Now validate the body using the dynamically adjusted schema
  const validatedLoanFormDetails = schema.safeParse(body);

  if (!validatedLoanFormDetails.success) {
    return {
      errors: formatZodErrors(
        validatedLoanFormDetails.error.flatten().fieldErrors
      ),
    };
  }

  if (!body.guarantorPassport) {
    return {
      errors: {
        guarantorPassport: "Passport is Required",
      },
    };
  }
  const file = await blobToFile(body.guarantorPassport, "guarantor-passport");
  console.log(file);
  const { width, height } = await getImageDimensions(file);

  if (!(width >= 600 && width <= 700 && height >= 600 && height <= 700))
    return {
      errors: {
        guarantorPassport: "Passport should be size 600 x 700",
      },
    };

  formData.append("file", file!);
  const options: RequestInit = {
    method: body.service === "addLoan" ? "POST" : "PUT",
    body: formData,
    // headers: { "Content-Type": 'multipart/form-data'},
  };
  // const response = await makeRequest("api")
  const url =
    body.service === "addLoan" ? "/api/loans" : `/api/loans?id=${body.id}`;
  const response = await makeRequest(url, options);

  const { success, message } = response;
  if (!success)
    return {
      errors: message,
    };
  return { message: message };
}
