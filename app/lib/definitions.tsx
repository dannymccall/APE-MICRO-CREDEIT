import { z } from "zod";
import { makeRequest } from "./utils";

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .trim(),

  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters long" })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const addUserSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "Last name  must be at least 2 characters long" })
    .trim(),

  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      // Check if the date is valid
      return !isNaN(Date.parse(date));
    }, "Invalid date format. Expected format: YYYY-MM-DD"),
  sex: z.enum(["Male", "Female"]),
  roles: z.string().min(1, "Role is required"),
});

export type AddUserState =
  | {
      errors?: {
        firstName?: [];
        lastName?: [];
        otherNames?: [];
        dob?: [];
        sex?: [];
        roles?: [];
      };
      message?: string;
    }
  | undefined;

export const addBranchSchema = z.object({
  branchName: z
    .string()
    .min(2, { message: "Branch name must be atleast 2 characters" })
    .trim(),
});

export type AddBranchState =
  | {
      errors?: {
        branchName?: [];
      };
      message?: string;
    }
  | undefined;

export const addClientSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must atleast 2 characters" })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "Last name must atleast 2 characters" })
    .trim(),
  nickName: z
    .string()
    .min(2, { message: "Nick name must atleast 2 characters" })
    .trim(),
  title: z.enum(["Mr", "Mrs", "Miss", "Dr"]).or(z.literal("")),
  union: z
    .string()
    .min(2, { message: "Union must atleast 2 characters" })
    .trim(),
  unionLocation: z
    .string()
    .min(2, { message: "Union location must atleast 2 characters" })
    .trim(),
  mobile: z
    .string()
    .length(10, { message: "Mobile must atleast 10 characters" })
    .trim(),
  residence: z
    .string()
    .min(2, { message: "Mobile must atleast 2 characters" })
    .trim(),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      // Check if the date is valid
      return !isNaN(Date.parse(date));
    }, "Invalid date format. Expected format: YYYY-MM-DD"),
  idType: z
    .string()
    .min(2, { message: "ID type must atleast 2 characters" })
    .trim(),
  idNumber: z
    .string()
    .min(2, { message: "ID number  must atleast 2 characters" })
    .trim(),
  staff: z.string(),
  gender: z.enum(["Male", "Female"]),
  maritalStatus: z.enum(["Married", "Single", "Divorced", "Widowed"]),
  passport: z
    .custom<File>((file) => file instanceof File, {
      message: "Please upload a valid file.",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB.",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "File type must be JPEG, JPG or PNG.",
      }
    )
    .optional(),
});

export type AddClientState =
  | {
      errors?: {
        firstName?: [];
        lastName?: [];
        nickName?: [];
        title?: [];
        branch?: [];
        union?: [];
        unionLocation?: [];
        mobile?: [];
        residence?: [];
        dob?: [];
        idType?: [];
        idNumber?: [];
        staff?: [];
        gender?: [];
        maritalStatus?: [];
        passport?: [];
      };
      message?: string;
    }
  | undefined;
