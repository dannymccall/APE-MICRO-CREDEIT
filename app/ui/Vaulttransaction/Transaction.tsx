"use client";
import { formatCurrency, formatDate } from "@/app/lib/helperFunctions";
import React, { useState } from "react";

export interface ITransaction {
  transaction: {
    _id: string;
    type: string;
    amount: number;
    staff: {
      first_name: string;
      other_names: string;
      last_name: string;
    };
    createdAt: string
  };

}
// interface ActivityProps {
//   activity: IActivity;
// }

const Transaction: React.FC<ITransaction> = ({ transaction }) => {
  return (
    <>
      <tr key={transaction._id} className="hover:bg-gray-100 relative">
        <td className="p-2 font-mono font-normal text-gray-700 text-left">
          {formatDate(transaction.createdAt)}
        </td>
        <td className="p-2 font-mono font-normal text-gray-700 text-left">
          {transaction.type }
        </td>
        <td className="p-2 font-mono font-normal text-gray-700 text-left">
          {formatCurrency(transaction.amount)}
        </td>
        <td className="p-2 font-mono font-normal text-gray-700 text-left">
          {transaction.staff
            ? `${transaction.staff.first_name} ${
                transaction.staff.other_names || ""
              } ${transaction.staff.last_name}`
            : "Unknown User"}
        </td>
      </tr>
    </>
  );
};

export default Transaction;
