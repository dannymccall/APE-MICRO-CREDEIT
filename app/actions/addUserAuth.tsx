import { addUserSchema, AddUserState } from "@/app/lib/definitions";
import {
  createResponse,
  extractFormFields,
  makeRequest,
} from "@/app/lib/helperFunctions";
import { formatZodErrors } from "@/app/lib/helperFunctions";
export async function addUser(state: AddUserState, formData: FormData) {
  const expectedFields = [
    "firstName",
    "lastName",
    "otherNames",
    "dob",
    "sex",
    "roles",
    "email",
    "service",
    "id",
  ];

  const body = extractFormFields(formData, expectedFields);
  console.log(body)
  // Validate the form data against the schema
  const validateAddUserFormDetails = addUserSchema.safeParse(body);
  if (!validateAddUserFormDetails.success) {
    return {
      errors: formatZodErrors(
        validateAddUserFormDetails.error.flatten().fieldErrors
      ),
    };
  }

  // Prepare the request options
  const options: RequestInit = {
    method: body["service"] === "add" ? "POST" : "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };

  try {
    // Send the request to the API
    const response: any = await makeRequest("/api/users", options);
    console.log({response})
    const { success, message } = response;
    if (!success) return { response: {success,message} };

    return { response: {success, message: "User added successfully!" }};
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

