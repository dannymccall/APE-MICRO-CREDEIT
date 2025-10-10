import { mkdir, writeFile } from "fs/promises";
import { Jimp } from "jimp";
import { NextResponse } from "next/server";
import { join } from "path";
import { useLogginIdentity } from "./hooks/useLogginIdentity";
import { io } from "socket.io-client";
export async function makeRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data)
    if (!response.ok) {
      // console.log(response);
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
    // console.error("Request failed:", error.message);
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
    {
      status: status,
      headers: {
        "Cache-Control": "no-store", // Prevent caching
      },
    }
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


export function getTotalWeeks(months: number): number {
  const weeksPerMonth = 4;
  return months * weeksPerMonth;
}

export function calculateLoanInformation(
  principal: number,
  durationInMonths: number,
  interestPerMonth: number
) {
  const numberOfWeeks = getTotalWeeks(durationInMonths);
  
  // Flat interest calculation
  const totalInterest = (interestPerMonth / 100) * principal * durationInMonths;
  const totalPayment = principal + totalInterest;

  const expectedWeeklyPayment = totalPayment / numberOfWeeks;

  return parseFloat(expectedWeeklyPayment.toFixed(2));
}


// console.log(calculateLoanInformaion(1000, 3, 2.67)); // Example usage

export function calculateProcessingAndAdvanceFee(principal: number) {
  const processingFee = (Number(principal) * 0.05).toFixed(2);
  const advanceFee = (Number(principal) * 0.1).toFixed(2);

  return [processingFee, advanceFee];
}

export function calculateNextPayment(lastPaymentDate: Date) {
  const date = new Date(lastPaymentDate);

  date.setDate(date.getDate() + 7);

  return date.toISOString().split("T")[0];
}

export async function blobToFile(blobType: string, imageName: string) {
  try {
    const res = await fetch(blobType, { method: "GET" });

    if (!res.ok) {
      console.log(res.statusText);
      return;
    }

    const blob = await res.blob();

    // Extract file extension from blob type
    const extension = blob.type.split("/")[1] || "png"; // Default to png if unknown

    // Ensure the filename has the correct extension
    const finalFileName = imageName.includes(".")
      ? imageName
      : `${imageName}.${extension}`;

    const file = new File([blob], finalFileName, { type: blob.type });

    // console.log(file);
    return file;
  } catch (e: any) {
    console.log(e.message);
  }
}

export function generateSystemID(prefix: string): string {
  const year = new Date().getFullYear().toString().slice(-2); // Last two digits of the year

  // Generate a random 4-character alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Combine parts to create the client ID
  return `${prefix}-${year}${randomPart}`;
}

type PaymentSchedule = {
  week: number;
  nextPayment: string; // ISO string for the date
  amountToPay: number;
  status: string;
  principalPayment: number;
  interestPayment: number;
  outStandingBalance: number;
  amountPaid: number;
};



export function generatePaymentSchedule(
  principal: number,
  startDate: Date,
  amountToPay: number,
  loanTerms: number
): PaymentSchedule[] {
  const schedule: PaymentSchedule[] = [];
  const numberOfWeeks = getTotalWeeks(loanTerms);
  for (let i = 1; i <= numberOfWeeks; i++) {
    const paymentDate = new Date(startDate);
    paymentDate.setDate(startDate.getDate() + i * 7); // Add 7 days per week
    schedule.push({
      week: i,
      nextPayment: paymentDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      amountToPay: Math.floor(amountToPay),
      status: "not paid",
      principalPayment: Math.floor(Number(principal) / numberOfWeeks),
      interestPayment: Math.ceil(Number(principal) * 0.0267),
      outStandingBalance: Math.floor(amountToPay),
      amountPaid: 0,
    });
  }

  return schedule;
}

export const fetchClients = async (search: string = "") => {
  try {
    const clientResponse = await makeRequest(`/api/clients?search=${search}`, {
      method: "GET",
      cache: "no-store",
    });
    return clientResponse;
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
};

export const fetchPaymentClients = async (
  clientId: string,
  paymentType: string
) => {
  try {
    const res = await makeRequest(
      `api/payments?clientId=${clientId}&paymentType=${paymentType}`,
      { method: "GET", cache: "no-store" }
    );
    return res;
  } catch (error) {
    console.log("Error fetching client: ", error);
  }
};

type TPaymentDetails = {
  amount: number;
  loanId: string;
  clientId: string;
  nextPayment: string;
};

type SuccessMessage = {
  showMessage: boolean;
  message: string;
  messageType: "success" | "errMessage";
};

interface ILogginIdentity {
  fullName: string;
  userRoles: string[];
  userName: string;
}

type MakeRequestFn = (url: string, options: RequestInit) => Promise<any>;

export async function processFormSubmissions(
  endpoint: string,
  setPending: (state: boolean) => void,
  setSuccessMessage: (message: SuccessMessage) => void,
  makeRequest: MakeRequestFn,
  logginIdentity: ILogginIdentity
) {
  try {
    const forms = Array.from(document.querySelectorAll("form"));
    const userRoles = logginIdentity.userRoles || [];
    setPending(true);

    let body: TPaymentDetails[] = [];
    let errorCount = 0;

    // Process form data
    forms.forEach((formItem) => {
      const formData = new FormData(formItem as HTMLFormElement);
      const amount = formData.get("amount") as unknown as number;
      const loanId = formData.get("loanId") as string;
      const clientId = formData.get("clientId") as string;
      const nextPayment = formData.get("nextPayment") as string;

      // Validate required fields
      if (!amount) {
        errorCount++;
      }

      body.push({ amount, loanId, clientId, nextPayment });
    });
    console.log({ body });

    // Validate that at least one field is filled
    const hasAtLeastOneFieldFilled = body.some((item) => item.amount);
    if (!hasAtLeastOneFieldFilled) {
      setPending(false);
      setSuccessMessage({
        showMessage: true,
        message: "At least one text box must be filled.",
        messageType: "errMessage",
      });
      return;
    }

    // Make the API request
    const response = await makeRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { success, message } = response;

    if (success) {
      setSuccessMessage({
        showMessage: true,
        message,
        messageType: "success",
      });

      const socket = io("http://localhost:3001");
      if (userRoles.includes("Loan officer")) {
        socket.emit("paymentMade", "A new payment awaits your approval");
      }
      // Reload after success with a delay
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      console.error("Failed to submit payments:", message);
      setSuccessMessage({
        showMessage: true,
        message: "Failed to submit payments.",
        messageType: "errMessage",
      });
    }
  } catch (error) {
    // console.error("Error processing forms:", error);
    setSuccessMessage({
      showMessage: true,
      message: "An error occurred while processing forms.",
      messageType: "errMessage",
    });
  } finally {
    setPending(false);
  }
}

// const mailOptions: = {
//   from: '"Your App" no-reply@gmail.com', // Sender address,
//   to, // Recipient address
//   subject, // Subject line
//   text, // Plain text body
//   html, // HTML body (optional)
// };

export function validatePassword(password: string) {
  // Check password length
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  // Check for a digit
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  // Check for a special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  // If all checks pass
  return "success";
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
  }).format(value);

export function getOutstandingBalances(loans: any) {
  interface LoanDetails {
    loanId: string;
    loanMaturityDate: string;
    loanDisbursementDate: string;
    clientName: string;
    clientMobile: string;
    clientUnion: string;
    clientUnionLocation: string;
    guarantorName: string;
    guarantorMobile: string;
    totalPrincipal: number;
    totalInterest: number;
    totalWeeklyAmount: number;
    totalOutstandingBalance: number;
    totalAmountLeft: number;
    totalAmountPaid: number;
    loanProduct: string;
  }

  const loanArray = Array.isArray(loans) ? loans : [loans];

  const data = loanArray.map((loan: any): LoanDetails => {
    let totalPrincipal: number = loan.principal || 0;
    let totalInterest: number = 0;
    let totalWeeklyAmount: number = 0;
    let totalOutstandingBalance: number = 0;
    let totalAmountLeft: number = 0;
    let totalAmountPaid: number = 0;
    // Check if paymentSchedule and schedule exist
    if (
      loan &&
      loan.paymentSchedule &&
      Array.isArray(loan.paymentSchedule.schedule)
    ) {
      // Calculate totalOutstandingBalance for each loan item
      loan.paymentSchedule.schedule.forEach((schedule: any) => {
        totalOutstandingBalance +=
          (schedule.principalPayment || 0) + (schedule.interestPayment || 0) ||
          0;
        totalInterest += schedule.interestPayment || 0;
        totalWeeklyAmount += schedule.principalPayment || 0;
        totalAmountLeft +=
          (schedule.amountToPay || 0) - (schedule.amountPaid || 0);
        totalAmountPaid += schedule.amountPaid || 0;
      });
    }

    return {
      loanId: loan._id,
      loanMaturityDate: loan.maturityDate,
      loanDisbursementDate: loan.expectedDisbursementDate,
      loanProduct: loan.loanProduct,
      clientName: `${
        loan.client && typeof loan.client !== "string"
          ? loan.client.first_name
          : "N/A"
      } ${
        loan.client && typeof loan.client !== "string"
          ? loan.client.last_name
          : "N/A"
      }`,
      clientMobile: `${
        loan.client && typeof loan.client !== "string"
          ? loan.client.mobile
          : "N/A"
      }`,
      clientUnion: `${
        loan.client && typeof loan.client !== "string"
          ? loan.client.union
          : "N/A"
      }`,
      clientUnionLocation: `${
        loan.client && typeof loan.client !== "string"
          ? loan.client.unionLocation
          : "N/A"
      }`,
      guarantorName:
        loan.guarantor && typeof loan.guarantor !== "string"
          ? loan.guarantor.guarantorFullName
          : "N/A",
      guarantorMobile: `${loan.guarantor ? loan.guarantor.mobile : "N/A"}`,
      totalPrincipal,
      totalInterest,
      totalWeeklyAmount,
      totalOutstandingBalance,
      totalAmountLeft,
      totalAmountPaid,
    };
  });

  return data;
}

export const generateDocument = async (
  reportGenerationRef: React.RefObject<HTMLDivElement>,
  type: "pdf" | "excel",
  setLoading: (loading: boolean) => void
) => {
  if (!reportGenerationRef.current) return;

  setLoading(true);

  // Get the HTML content of the report
  const html = reportGenerationRef.current.outerHTML;

  try {
    const res = await fetch(
      `http://localhost:3000/api/generate-document/${type}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      }
    );

    if (!res.ok) throw new Error(`Failed to generate ${type.toUpperCase()}`);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = `report.${type === "pdf" ? "pdf" : "xlsx"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error:any) {
    // console.error(`Error generating ${type.toUpperCase()}:`, error);
    throw new Error(error)
  } finally {
    setLoading(false);
  }
};

export function getLoanInfomation(type: string) {
  let interestRate: number = 0;
  switch (type.toLowerCase()) {
    case "monthly":
      interestRate = 10.67;
      break;
    case "weekly":
      interestRate = 2.67;
      break;
    default:
      return "invalid type";
  }

  return interestRate;
}
