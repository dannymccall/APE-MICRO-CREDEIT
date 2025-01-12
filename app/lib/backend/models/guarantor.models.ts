import mongoose, { Schema, Document } from "mongoose";

export interface IGuatantor extends Document {
  guarantorFullName: string;
  guarantorOccupation: string;
  guarantorUnionName: string;
  guarantorResidence: string;
  avarta: string; // or Buffer for file
  systemId: string;
  loan: mongoose.Types.ObjectId;
  mobile: string;
  client: mongoose.Types.ObjectId
}

const GuarantorSchema: Schema = new Schema<IGuatantor>(
  {
    guarantorFullName: {
      type: String,
      min: [3, "Guarantor full name must be at least 3 characters long"],
      required: true,
    },
    guarantorOccupation: {
      type: String,
      min: [3, "Guarantor occupation must be at least 3 characters long"],
      required: true,
    },
    guarantorUnionName: {
      type: String,
      min: [3, "Guarantor union name must be at least 3 characters long"],
      required: true,
    },
    guarantorResidence: {
      type: String,
      min: [3, "Guarantor residence must be at least 3 characters long"],
      required: true,
    },
    avarta: { type: String, required: true },
    loan: {
      type: Schema.Types.ObjectId,
      ref: "LoanApplication",
      required: true,
    },
    systemId: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true
    }
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Guarantor) {
  // Delete the existing model to allow redefinition
  delete mongoose.models.Guarantor;
}

export const Guarantor =
  mongoose.model<IGuatantor>("Guarantor", GuarantorSchema);
