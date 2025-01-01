import { addUserSchema, AddUserState } from "@/app/lib/definitions";
import {
  createResponse,
  extractFormFields,
  makeRequest,
} from "@/app/lib/utils";
import { formatZodErrors } from "@/app/lib/utils";
export async function addUser(state: AddUserState, formData: FormData) {
  // Define the body object explicitly for better type safety
  // console.log({formData})
  // const body: Record<string, string | null> = {
  //   firstName: formData.get("firstName") as string,
  //   lastName: formData.get("lastName") as string,
  //   otherNames: formData.get("otherNames") as string,
  //   dob: formData.get("dob") as string,
  //   sex: formData.get("sex") as string,
  //   roles: formData.get("roles") as string,
  // };
  const expectedFields = [
    "firstName",
    "lastName",
    "otherNames",
    "dob",
    "sex",
    "roles",
  ];

  const body = extractFormFields(formData, expectedFields);

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
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };

  try {
    // Send the request to the API
    const response: any = await makeRequest("/api/users", options);

    const { success, message } = response;
    if (!success) return { message };

    
    return { message: "User added successfully!" };

  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

// Utility function to format Zod validation errors

export async function updateUser(state: AddUserState, formData: FormData) {
  const expectedFields = [
    "firstName",
    "lastName",
    "otherNames",
    "dob",
    "sex",
    "roles",
    "id",
  ];

  const body = extractFormFields(formData, expectedFields);

  // Validate the form data against the schema
  const validateAddUserFormDetails = addUserSchema.safeParse(body);
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
      `/api/users?id=${body.id}`,
      options
    );

    const { success, message } = response;
    if (!success) return { message };
    return { message: "User updated successfully!" };
    // if(success)
  } catch (error: any) {
    // console.log("Error adding user:", error.message);
    return { error: error.message || "An unexpected error occurred." };
  }
}
