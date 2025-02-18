import { addBranchSchema, AddBranchState } from "../lib/definitions";
import { extractFormFields, formatZodErrors } from "../lib/helperFunctions";
import { makeRequest } from "../lib/helperFunctions";

export async function addBranch(state: AddBranchState, formData: FormData) {
  const body = extractFormFields(formData, ["branchName"]);

  const validateBranchFormDetails = addBranchSchema.safeParse(body);

  if (!validateBranchFormDetails.success)
    return {
      errors: formatZodErrors(
        validateBranchFormDetails.error.flatten().fieldErrors
      ),
    };

    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    };

    const res = await makeRequest("/api/branches", options);

    const { success, message } = res;
    if (!success) return { message };

    // Ensure the API returns a success response
    // const {  data } = response;

    // if (!message.success) {
    //   return { message:message.error.message};
    // }
    return { message: message };
}

export async function updateBranch(state: AddBranchState, formData: FormData) {
  const expectedFields = [
    "branchName",
   "id"
  ];

  const body = extractFormFields(formData, expectedFields);

  // Validate the form data against the schema
  const validateAddUserFormDetails = addBranchSchema.safeParse(body);
  if (!validateAddUserFormDetails.success) {
    return {
      errors: formatZodErrors(
        validateAddUserFormDetails.error.flatten().fieldErrors
      ),
    };
  }
  const options: RequestInit = {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
  try {
    // Send the request to the API
    const response: any = await makeRequest(
      `/api/branches?id=${body.id}`,
      options
    );

    const { success, message } = response;
    if (!success) return { message };

    // Ensure the API returns a success response
    // const {  data } = response;

    // if (!message.success) {
    //   return { message:message.error.message};
    // }
    return { message: "Branch updated successfully!" };
    // if(success)
  } catch (error: any) {
    // console.log("Error adding user:", error.message);
    return { error: error.message || "An unexpected error occurred." };
  }
}
