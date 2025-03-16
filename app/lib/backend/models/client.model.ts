import mongoose, { Document, mongo, Schema } from "mongoose";
import { User } from "./user.model";
// Define the IUser interface to match the schema structure
export interface IClient extends Document {
  first_name: string;
  last_name: string;
  nick_name?: string; // Optional
  title: string;
  dob: Date;
  gender: "male" | "female" | "others";
  union: string;
  unionLocation: string;
  mobile: string;
  residence: string;
  idType: string;
  idNumber: string;
  maritalStatus: "married" | "single" | "divorced" | "widowed";
  client_status?: string;
  staff: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  systemId: string;
  avarta: string;
  loans: mongoose.Types.ObjectId;
}

// Define the Mongoose schema
export const ClientSchema: Schema = new Schema<IClient>(
  {
    first_name: {
      type: String,
      required: true,
      minlength: [2, "First name must be at least two characters"],
    },
    last_name: {
      type: String,
      required: true,
      minlength: [2, "Last name must be at least two characters"],
    },
    nick_name: {
      type: String,
      required: true,
      minlength: [2, "Nick name must be at least two characters"],
    },
    title: {
      type: String,
      required: true,
      minlength: [2, "Title must be at least two characters"],
    },
    branch: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Branch",
    },
    union: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    unionLocation: {
      type: String,
      required: true,
      minlength: [2, "Union location must be at least two characters"],
    },
    mobile: {
      type: String,
      required: true,
      minlength: [2, "Union location must be at least two characters"],
    },
    residence: {
      type: String,
      required: true,
      minlength: [2, "Residence must be at least two characters"],
    },
    idType: {
      type: String,
      required: [true, "ID Type required"],
    },
    idNumber: {
      type: String,
      minlength: [2, "ID Number must be at least two characters"],
    },
    maritalStatus: {
      type: String,
      required: true,
    },
    client_status: {
      type: String,
      default: "active",
    },
    staff: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    systemId: {
      type: String,
      required: true,
    },
    avarta: {
      type: String,
      required: true,
    },
    loans: [{ type: mongoose.Schema.Types.ObjectId, ref: "LoanApplication" }],
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Client) {
  // Delete the existing model to allow redefinition
  delete mongoose.models.Client;
}

// Export the model
export const Client = mongoose.model<IClient>("Client", ClientSchema);
