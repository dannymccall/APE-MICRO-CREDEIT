import { Jimp } from "jimp";
import { NextResponse } from "next/server";

export async function makeRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data)
    if (!response.ok) {
      const errorResponse = createResponse(
        false,
        data.error?.code,
        data.error?.message || "An unknown error occurred.",
        {}
      );
      return errorResponse.json();
    }

    return data;
  } catch (error: any) {
    console.error("Request failed:", error.message);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to the server. Please try again later.",
      },
    };
  }
}

export function createResponse(
  success: boolean,
  code: string,
  message: string,
  data: Record<string, string | any> = {},
  pagination: Record<string, string | any> = {},
  status?: number | any
) {
  return NextResponse.json(
    { success, code, message, data, pagination },
    { status: status }
  );
}

export function extractFormFields(
  formData: FormData,
  fieldNames: string[]
): Record<string, string | null> {
  const body: Record<string, string | null> = {};

  fieldNames.forEach((fieldName) => {
    body[fieldName] = formData.get(fieldName) as string | null;
  });

  return body;
}

export function formatDate(dob: any) {
  let date = new Date(dob);

  if (date instanceof Date) {
    // Format the date as YYYY-MM-DD
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`; // Returns date in YYYY-MM-DD format
  } else {
    return "Invalid date";
  }
}

export function formatZodErrors(
  errors: Record<string, string[]>
): Record<string, string[] | string> {
  const formattedErrors: Record<string, string> = {};
  for (const [field, messages] of Object.entries(errors)) {
    formattedErrors[field] = messages.join(", ");
  }
  return formattedErrors;
}

export function saveToLocalStorage(key: string, value: any): void {
  localStorage.setItem(key, value);
}

// Usage

export function getFromLocalStorage(key: string): any | null {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    return item ? item : null;
  }
}

// Usage
// const user = getFromLocalStorage<{ name: string; age: number }>("user");
// if (user) {
//   console.log(user.name); // John
// }

export function clearLocalStorage(): void {
  return localStorage.clear();
}

// Usage

export function getImageDimensions(
  file: File | any
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Load the image file as a data URL
    reader.onload = (event) => {
      const img = new Image();

      // Set up the image's onload handler to get its dimensions
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = (err) => {
        reject(new Error("Failed to load image"));
      };

      // Set the image's source to the data URL
      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  });
}

export function validateNumber(number: string) {
  const regex = /^(?:\+233|233|0)(2[0-9]|3[0-9]|5[0-9])[0-9]{7}$/;
  return regex.test(number);
}

function validateString(str: string, value: string): string {
  const regex = /^[a-zA-Z\s'-]+$/;
  if (str.trim() && !regex.test(str.trim()))
    return `${value.toLowerCase()} must be a valid name`;
  return "";
}

export function validateFields(body: any, excludedKeys: Set<string>) {
  for (const [key, value] of Object.entries(body)) {
    if (!excludedKeys.has(key)) {
      const message = validateString(value as string, key);
      if (message) return message;
    }
  }
  return null;
}

export async function validateImageDimensions(
  filePath: any,
  width: number,
  height: number
): Promise<boolean> {
  const image = await Jimp.read(filePath);
  return image.bitmap.width === width && image.bitmap.height === height;
}

export function toCapitalized(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
