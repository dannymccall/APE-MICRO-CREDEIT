import { extractFormFields, makeRequest } from "../lib/helperFunctions";

type ReportState =
  | {
      errors?: {
        startDate?: string[];
        endDate?: string[];
        filters?: string[];
      };

      response?: { message?: string; data?: [] };
    }
  | undefined;

export async function processReport(state: ReportState, formData: FormData) {
  const expectedFields = ["startDate", "endDate", "filters"];
  const body = extractFormFields(formData, expectedFields);
  if (new Date(body.startDate as string) > new Date(body.endDate as string)) {
    return {
      errors: {
        startDate: ["Start date cannot be greater than end date"],
        endDate: ["End date must be after start date"],
      },
      response: {
        message: "Please correct the errors below.",
      },
    };
  }

  // Perform further processing here if dates are valid

  const options: RequestInit = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
  const response = await makeRequest("/api/report", options);

  return {
    response: {
      message: "Report processed successfully!",
      data: response,
    },
  };
}
