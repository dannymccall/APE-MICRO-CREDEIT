"use client";

import React, { useState } from "react";
import { IUser } from "@/app/lib/backend/models/user.model";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { IoCaretForward } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";
import Transaction, { ITransaction } from "./Transaction";


interface TransactionListProps {
  transactions: ITransaction[];
  
}
const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

  const paginatedTransactions: ITransaction[] = transactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // console.log({paginatedTransactions})
  return (
    // <div className="bg-white w-full">
    //   <div className="w-full h-full bg-white relative">
    <div className="bg-white w-full">
        {
            transactions.length > 0 ? (
      <div className="w-full h-full bg-white relative">
        <table className="table m-3">
          {/* head */}
          <thead className="relative">
            <tr className="relative bg-violet-200">
              <th className="text-base font-sans font-medium text-gray-700 text-left p-2">
                Transacton Date
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Type
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Amount
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Purpose
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Action Taker
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {paginatedTransactions.map((transaction: any) => (
              <Transaction key={transaction._id} transaction={transaction} />
            ))}
          </tbody>
        </table>
        <div className="flex gap-5 mt-4 items-center">
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>):""
        }
    </div>
  );
};

export default TransactionList;
