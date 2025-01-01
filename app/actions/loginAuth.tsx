import { loginFormSchema, FormState } from "@/app/lib/definitions";
import { CgPassword } from "react-icons/cg";
import { saveToLocalStorage } from "@/app/lib/utils";
import { extractFormFields } from "@/app/lib/utils";
import { makeRequest } from "@/app/lib/utils";
import { encryptData } from "@/app/lib/session/security";

export async function signin(state: FormState, formData: FormData) {
  const validateLoginFields = loginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validateLoginFields.success) {
    return {
      errors: validateLoginFields.error.flatten().fieldErrors,
    };
  }

  const formFields = ["username", "password"];
  const body = extractFormFields(formData, formFields);

  const res: any = await makeRequest("/api/auth", {
    body: JSON.stringify(body),
    method: "POST",
    headers: { "Content-Type": "application/json" },

  });

  console.log(res)

  const { success, message, data: user } = res;
  if (!success) return { message: message };

  const logginIdentity = {
   fullName: `${user.first_name} ${user.other_names} ${user.last_name}`,
   userName: user.username,
   userRoles: user.roles
  }
  saveToLocalStorage("logginIdentity", JSON.stringify(logginIdentity))

  console.log({ user });
  return {message}
}
