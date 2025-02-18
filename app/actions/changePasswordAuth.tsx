import { ChangePasswordSchema, ChangePasswordState } from "../lib/definitions";
import {
  extractFormFields,
  formatZodErrors,
  validatePassword,
  makeRequest,
} from "../lib/helperFunctions";

export async function changePassword(
  state: ChangePasswordState | undefined,
  formData: FormData
) {
  const expectedFields = [
    "current_password",
    "password",
    "confirm_password",
    "username",
  ];

  const body = extractFormFields(formData, expectedFields);
  const validateChangePasswordSchema = ChangePasswordSchema.safeParse(body);

  if (!validateChangePasswordSchema.success) {
    return {
      errors: formatZodErrors(
        validateChangePasswordSchema.error.flatten().fieldErrors
      ),
    };
  }

  if (body["password"] !== body["confirm_password"]) {
    return {
      response: {
        message: "Passwords do not match",
        success: false,
      },
    };
  }

  const isPasswordValid = validatePassword(body["password"] as string);
  console.log(isPasswordValid);
    if (isPasswordValid !== "success")  {
      return {
        errors: {
          password: isPasswordValid,
        },
      };
    }

  const options: RequestInit = {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };

  const response = await makeRequest(
    `/api/auth?changePassword=${true}`,
    options
  );

  const { success, message } = response;

  if (!success) return { response: { success, message } };

  return { response: { success, message } };
}
