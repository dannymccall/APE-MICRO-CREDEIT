import { loginFormSchema, FormState } from "@/app/lib/definitions";
import { CgPassword } from "react-icons/cg";
import { saveToLocalStorage } from "@/app/lib/helperFunctions";
import { extractFormFields } from "@/app/lib/helperFunctions";
import { makeRequest } from "@/app/lib/helperFunctions";
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

  console.log(res);

  const { success, message, data: user } = res;
  if (!success) {
    console.log(success, message)
    return { response: { success, message } };
  } 

  const logginIdentity = {
    fullName: `${user.first_name} ${user.other_names} ${user.last_name}`,
    userName: user.username,
    userRoles: user.roles,
  };
  saveToLocalStorage("logginIdentity", JSON.stringify(logginIdentity));

  console.log({ user });
  return { response: { success: success, message: message } };
}
