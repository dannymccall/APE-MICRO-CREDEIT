import mongoose, { Document, Schema } from "mongoose";

// Define the IUser interface to match the schema structure
export interface IUser extends Document {
  first_name: string;
  last_name: string;
  other_names?: string; // Optional
  username: string;
  roles: string[];
  dob: Date;
  sex: "male" | "female" | "others";
  password: string,
  online_status?: string,
  number_of_password_changes?: number
}

// Define the Mongoose schema
const UserSchema: Schema = new Schema<IUser>(
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
    other_names: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [2, "Username must be at least two characters"],
    },
    password: {
      type: String,
      required: true,
      unique: true,
      minlength: [2, "Username must be at least two characters"],
    },
    roles: {
      type: [String],
      required: true,
    },
    dob: {
      type: Date,
    },
    sex: {
      type: String,
      enum: ["male", "female", "others"],
    },

    online_status: {
      type: String,
      default: "offline"
    },
    number_of_password_changes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.User) {
  // Delete the existing model to allow redefinition
  delete mongoose.models.User;
}

// Export the model
export const User = mongoose.model<IUser>("User", UserSchema);
