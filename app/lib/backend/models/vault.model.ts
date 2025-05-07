import mongoose, { Schema, Document } from "mongoose";
import { number } from "zod";

export interface IVault extends Schema {
  balance: number;
  transactions: Array<{
    type: string;
    purpose?: string;
    amount: number;
    staff: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;
  save: () => Promise<void>;
}

export const VaultSchema: Schema = new Schema<IVault>(
  {
    balance: {
      type: Number,
      required: true,
    },
    transactions: [
      {
        type: {
          type: String,
          required: true,
        },
        purpose: {
          type: String,
    
        },
        amount: {
          type: Number,
          required: true,
        },
        staff: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the Staff collection
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Vault) {
  delete mongoose.models.Vault;
}

export const Vault = mongoose.model<IVault>("Vault", VaultSchema);
