import { error } from "console";
import { addClientSchema, AddClientState } from "../lib/definitions";
import {
  makeRequest,
  extractFormFields,
  formatZodErrors,
  getImageDimensions,
} from "@/app/lib/helperFunctions";

export async function addClient(state: AddClientState, formData: FormData) {
  const expectedFields = [
    "firstName",
    "lastName",
    "nickName",
    "title",
    "branch",
    "union",
    "unionLocation",
    "mobile",
    "residence",
    "dob",
    "idType",
    "idNumber",
    "staff",
    "gender",
    "maritalStatus",
    "passport",
    "service",
    "id",
  ];

  const body: any = extractFormFields(formData, expectedFields);
  console.log(body);

  let schema: any = addClientSchema; // Start with the base schema

  if (body.service !== "addClient") {
    // Conditionally omit the 'passport' field
    schema = schema.omit({ passport: true });
  }

  // Now validate the body using the dynamically adjusted schema
  const validatedClientFormDetails = schema.safeParse(body);

  if (!validatedClientFormDetails.success) {
    return {
      errors: formatZodErrors(
        validatedClientFormDetails.error.flatten().fieldErrors
      ),
    };
  }
  const options: RequestInit = {
    method: body.service === "addClient" ? "POST" : "PUT",
    body: formData,
    // headers: { "Content-Type": 'multipart/form-data'},
  };
  console.log(body.passport);
  // if (
  //   body.service === "addClient" ||
  //   (body.service === "updateClient" && body.passport.name !== "")
  // ) {
  //   const { width, height } = await getImageDimensions(body.passport);
  //   if (!(width >= 600 && width <= 700 && height >= 600 && height <= 700))
  //     return {
  //       errors: {
  //         passport: "Passport should be size 600 x 700",
  //       },
  //     };
  // }

  console.log(formData);

  const url =
    body.service === "addClient" ? "/api/clients" : `/api/clients?id=${body.id}`;
  const response = await makeRequest(url, options);
  console.log(response);
  const { success, message } = response;
  if (!success) {
    return { message: message };
  }

  return { message: message };

  // return { message: "okay" }
}
// export async function updateClient(state: AddClientState, formData: FormData) {
//   const expectedFields = [
//     "firstName",
//     "lastName",
//     "nickName",
//     "title",
//     "branch",
//     "union",
//     "unionLocation",
//     "mobile",
//     "residence",
//     "dob",
//     "idType",
//     "idNumber",
//     "staff",
//     "gender",
//     "maritalStatus",
//     "passport",
//   ];

//   const body: any = extractFormFields(formData, expectedFields);
//   console.log(body);
//   const validatedClientFormDetails = addClientSchema.safeParse(body);

//   if (!validatedClientFormDetails.success)
//     return {
//       errors: formatZodErrors(
//         validatedClientFormDetails.error.flatten().fieldErrors
//       ),
//     };

//   const options: RequestInit = {
//     method: "POST",
//     body: formData,
//     // headers: { "Content-Type": 'multipart/form-data'},
//   };

//   const { width, height } = await getImageDimensions(body.passport);
//   if (!(width >= 600 && width <= 700 && height >= 600 && height <= 700))
//     return {
//       errors: {
//         passport: "Passport should be size 600 x 700",
//       },
//     };

//   console.log(formData);

//   const response = await makeRequest("/api/clients", options);
//   const { success, message } = response;
//   if (success) {
//     return { message: message };
//   }

//   // return { message: "okay" }
// }
