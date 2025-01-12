import mongoose, { Document, Schema } from "mongoose";

export interface IPaymentSchedule extends Document {
  loan: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  schedule: Array<{
    nextPayment: Date;
    amountToPay: number;
    status: string;
    week: number;
    principalPayment: number,
    interestPayment: number
  }>;
}

const PaymentScheduleSchema: Schema = new Schema<IPaymentSchedule>({
  loan: {
    type: Schema.Types.ObjectId,
    ref: "LoanApplication", // Reference to the Loan model
    required: true,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "LoanApplication", // Reference to the Loan model
    required: true,
  },

  schedule: [
    {
      nextPayment: {
        type: Date,
        required: true,
      },
      amountToPay: {
        type: Number,
        required: true,
      },
      status: {
        type: String, // Updated to match the interface
        required: true,
      },
      week: {
        type: Number,
        required: true,
      },
      principalPayment: {
        type: Number,
        required: true
      },
      interestPayment: {
        type: Number,
        required: true
      }
    },
  ],
});

if (mongoose.models.PaymentSchedule) {
  // Delete the existing model to allow redefinition
  delete mongoose.models.PaymentSchedule;
}

// Define the model with the updated schema
export const PaymentSchedule = mongoose.model<IPaymentSchedule>(
  "PaymentSchedule",
  PaymentScheduleSchema
)
