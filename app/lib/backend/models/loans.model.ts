import mongoose, { Schema, Document } from "mongoose";

export interface ILoanApplication extends Document {
  client: mongoose.Types.ObjectId;
  loanProduct: string;
  principal: number;
  fund: string;
  loanTerms: string;
  repaymentFrequency: string;
  type: string;
  expectedDisbursementDate: string; // or Date
  loanOfficer: mongoose.Types.ObjectId;
  loanPurpose: string;
  // registrationFee: number;
  systemId: string;
  paymentSchedule: mongoose.Types.ObjectId;
  guarantor: mongoose.Types.ObjectId;
  nextPayment: Date;
  monthlyInterest: number;
  // processingFee: number;
  // advanceFee: number;
  weeklyAmount: number;
  paymentStatus: string
  principalPayment: number;
  interestPayment: number;
  nextPaymentStatus: string;
  loanApprovalStatus: string;
  maturityDate: string
}

export const LoanApplicationSchema: Schema = new Schema<ILoanApplication>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    loanProduct: {
      type: String,
      min: [3, "Loan product must be at least 3 characters long"],
      required: true,
    },
    principal: {
      type: Number,
      min: [0, "Principal must be at least 0"],
      required: true,
    },
    fund: {
      type: String,
      min: [3, "Fund must be at least 3 characters long"],
      required: true,
    },
    loanTerms: {
      type: String,
      min: [3, "Loan terms must be at least 3 characters long"],
      required: true,
    },
    repaymentFrequency: {
      type: String,
      min: [3, "Repayment frequency must be at least 3 characters long"],
      required: true,
    },
    type: {
      type: String,
      min: [3, "Type must be at least 3 characters long"],
      required: true,
    },
    expectedDisbursementDate: { type: String, required: true },
    loanOfficer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    loanPurpose: {
      type: String,
      min: [3, "Loan purpose must be at least 3 characters long"],
      required: true,
    },
    // registrationFee: {
    //   type: Number,
    //   min: [0, "Registration fee must be at least 0"],
    //   required: true,
    // },
    systemId: {
      type: String,
      required: true,
    },
    paymentSchedule: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "PaymentSchedule",
    },
    guarantor: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Guarantor",
    },
    nextPayment: {
      type: Date,
      requried: true,
    },

    weeklyAmount: {
      type: Number,
      required: true,
    },
    monthlyInterest: {
      type: Number,
      required: true,
    },
    // processingFee: {
    //   type: Number,
    //   required: true,
    // },
    // advanceFee: {
    //   type: Number,
    //   required: true,
    // },
    paymentStatus: {
      type: String,
      default: "not completed"
    },
    principalPayment:{
      type:Number,
      required: true
    },
    interestPayment: {
      type: Number,
      required: true
    },
    nextPaymentStatus: {
      type: String,
      default: ""
    },
    loanApprovalStatus: {
      type: String,
      default: "Pending"
    },
    maturityDate: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);
if (mongoose.models.LoanApplication) {
  // Delete the existing model to allow redefinition
  delete mongoose.models.LoanApplication;
}

export const LoanApplication = mongoose.model<ILoanApplication>(
  "LoanApplication",
  LoanApplicationSchema
);
