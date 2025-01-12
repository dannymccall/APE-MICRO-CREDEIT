"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeRequest } from "@/app/lib/utils";
import { ILoanApplication } from "@/app/lib/backend/models/loans.model";
// import UsersList from "./usersList";
import { useRouter } from "next/navigation";

const LoanList = lazy(() => import("./loanList"));

import { LoadingDivs } from "@/app/component/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
const AllLoans = () => {
  const [loans, setLoans] = useState<ILoanApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchLoans() {
    try {
      const loans: any = await makeRequest(
        `api/loans?page=${currentPage}&limit=${10}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      setLoans(loans.data);
      setTotalPages(loans.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  const handleDelete = () => {
    fetchLoans();
  };
  useEffect(() => {
    fetchLoans();
  }, [currentPage]);
  const router = useRouter();

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "manage-loan",
      href: "/manage-loan",
    },
  ];

  const onClick = () => router.push("/add-loan");

  // const editUser = (updatedUser: any, id: string) => {
  //   console.log({updatedUser, id})
  //   if(id === updatedUser._id)console.log("correct")
  //   setUsers((prevUsers) =>
  //     prevUsers.map((user) =>
  //       user._id === id ? { ...user, ...updatedUser } : user
  //     )
  //   );
  //   console.log(users)
  // };
  

  return (
    <main className="min-w-full min-h-full mx-auto   bg-white ">
      <InfoHeaderComponent
        route={"All Loans"}
        links={breadcrumbsLinks}
        title="Add Loan"
        onClick={onClick}
      />
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4 bg-white shadow-lg"></div>
      <Suspense fallback={<LoadingDivs />}>
        <div className="p-10">
          <LoanList
            loans={loans}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            editUser={() => {}}
          />
        </div>
      </Suspense>
    </main>
  );
};

export default AllLoans;
