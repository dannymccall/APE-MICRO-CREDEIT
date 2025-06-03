"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeRequest } from "@/app/lib/helperFunctions";
import { IUser } from "@/app/lib/backend/models/user.model";
// import UsersList from "./usersList";
import { useRouter } from "next/navigation";

const TransactionList = lazy(() => import("./TransactionList"));

import { LoadingDivs } from "@/app/api/Loaders/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import SearchInput from "@/app/component/Search/SearchInput";
import { useSearch } from "@/app/lib/customHooks";
import { ITransaction } from "./Transaction";



interface TransactionProps {
    transactions: ITransaction[];
}
const AllTransactions:React.FC<TransactionProps> = ({transactions}) => {

  return (
    <main className="min-w-full min-h-full mx-auto">
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4 bg-white"></div>
    
        {transactions.length > 0 ? (
          <TransactionList
            transactions={transactions}
          />
        ) : (
          <div>No transactions found</div>
        )}
    </main>
  );
};

export default AllTransactions;
