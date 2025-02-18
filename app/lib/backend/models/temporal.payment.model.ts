import mongoose, { Schema, Document } from "mongoose";
import { number } from "zod";

export interface ITemporalPayment {
  loan: mongoose.Types.ObjectId;
  paymentDate: Date;
  client: mongoose.Types.ObjectId;
  weeklyAmountExpected: number;
  amountPaid: number;
}

const TemporalPaymentSchema: Schema = new Schema<ITemporalPayment>(
  {
    loan: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "LoanApplication",
    },
    paymentDate: { type: Date, required: true },
    client: { type: Schema.Types.ObjectId, required: true, ref: "Client" },
    weeklyAmountExpected: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
  },
  { timestamps: true }
);

if (mongoose.models.TemporalPayment) {
  // Delete the existing model to allow redefinition
  delete mongoose.models.TemporalPayment;
}

// Define the model with the updated schema
export const TemporalPayment = mongoose.model<ITemporalPayment>(
  "TemporalPayment",
  TemporalPaymentSchema
);
