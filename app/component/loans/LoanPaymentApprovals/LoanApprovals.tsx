"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeRequest } from "@/app/lib/helperFunctions";
// import UsersList from "./usersList";
import { useRouter } from "next/navigation";

const LoanApprovalList = lazy(() => import("./LoanApprovalList"));

import { LoadingDivs } from "@/app/api/Loaders/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { LoanApprovalProps } from "./LoanApproval";

const LoanApprovals = () => {
  const [pendingLoans, setPendingLoans] = useState<LoanApprovalProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchPeningLoans() {
    try {
      const pendingLoans: any = await makeRequest(
        `api/approveLoan?page=${currentPage}&limit=${10}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      console.log(pendingLoans);
      setPendingLoans(pendingLoans.data);
      setTotalPages(pendingLoans.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  const onApprove = () => {
    fetchPeningLoans();
  };
  useEffect(() => {
    fetchPeningLoans();
  }, [currentPage]);
  const router = useRouter();

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "approve-loan-payment",
      href: "/approve-loan-payment",
    },
  ];

  const onClick = () => router.push("/add-branch");

  return (
    <main className=" mx-auto">
      <InfoHeaderComponent
        route={"All Pending Approvals"}
        links={breadcrumbsLinks}
        title="Loan Recovery"
        onClick={onClick}
      />
      <div className="text-center mg-5 flex flex-col gap-4 shadow-lg"></div>
      <Suspense fallback={<LoadingDivs />}>
        <div className="p-10">
          {pendingLoans.length > 0 ? (
            <LoanApprovalList
              pendingLoans={pendingLoans}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              onApprove={onApprove}
            />
          ) : (
            <div className="bg-white p-3 rounded-md border-t-2 border-t-violet-600">
              <span>No Pending Loan Payments Approvals available</span>
            </div>
          )}
        </div>
      </Suspense>
    </main>
  );
};

export default LoanApprovals;
