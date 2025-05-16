import { NextRequest, NextResponse } from "next/server";
import {
  createResponse,
  makeRequest,
  toCapitalized,
} from "@/app/lib/helperFunctions";
import { getUserId } from "../auth/route";
import { IVault, Vault } from "@/app/lib/backend/models/vault.model";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const vaults: IVault[] = await Vault.find().populate({
    path: "transactions.staff", 
    select: ["first_name", "last_name", "other_names"],
  });
  const vault = vaults[0]; // Assuming you want the first vault
  console.log(vault);
  return NextResponse.json(vault, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(req: NextRequest) {
  const { type, amount, purpose } = await req.json();
  console.log({type, amount, purpose})
  try {
    const userId = new mongoose.Types.ObjectId(await getUserId());
    if (typeof amount !== "number" || amount <= 0)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    const vaults: IVault[] = await Vault.find();
    const vault = vaults[0]; // Assuming you want the first vault
    if (!vault) {
      const newVault = {
        balance: type === "deposit" ? amount : 0 - amount,
        transactions: [
          {
            type: toCapitalized(type),
            purpose,
            amount: amount,
            staff: userId,
            createdAt: new Date(),
          },
        ],
        staff: userId,
      };

      await Vault.create(newVault);
      return NextResponse.json({
        success: true,
        message: "Transaction successful",
        balance: newVault.balance,
      });
    }

    let vaultBalance = vault.balance;
    vault.transactions.push({
      type: toCapitalized(type),
      amount,
      purpose,
      staff: userId,
      createdAt: new Date(),
    });
    if (type === "deposit") {
      vaultBalance += amount;
      vault.balance = vaultBalance;
      await vault.save();
      return NextResponse.json({
        success: true,
        message: "Deposit successful",
        balance: vaultBalance,
      });
    } else if (type === "withdraw") {
      if (vaultBalance < amount) {
        return NextResponse.json({
          success: false,
          message: "Insufficient funds",
        });
      }
      vaultBalance -= amount;
      vault.balance = vaultBalance;
      await vault.save();
      return NextResponse.json({
        success: true,
        message: "Withdrawal successful",
        balance: vaultBalance,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
