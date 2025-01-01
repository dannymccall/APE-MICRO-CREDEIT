import mongoose, { Document, mongo, Schema } from "mongoose";

export interface IBranch extends Document {
  branchName: string;
  branchCode: string;
}

const BranchSchema: Schema = new Schema(
  {
    branchName: {
      type: String,
      required: true,
      minlength: [2, "Branch name must be at least two characters"],
    },
    branchCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Branch =
  mongoose.models.Branch || mongoose.model<IBranch>("Branch", BranchSchema);
