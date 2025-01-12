"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeRequest } from "@/app/lib/utils";
// import UsersList from "./usersList";
import { useRouter } from "next/navigation";

const BranchList = lazy(() => import("./branchList"));

import { LoadingDivs } from "@/app/component/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { IBranch } from "@/app/lib/backend/models/branch.model";

const AllBranches = () => {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchBranches() {
    try {
      const branches: any = await makeRequest(
        `api/branches?page=${currentPage}&limit=${10}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      setBranches(branches.data);
      setTotalPages(branches.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  const handleDelete = () => {
    fetchBranches();
  };
  useEffect(() => {
    fetchBranches();
  }, [currentPage]);
  const router = useRouter();

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "manage-branch",
      href: "/manage-branch",
    },
  ];

  const onClick = () => router.push("/add-branch");

  const editBranch = (updatedBranch: any, id: string) => {
    console.log({updatedBranch, id})
    if(id === updatedBranch._id)console.log("correct")
    setBranches((prevBranch) =>
      prevBranch.map((branch) =>
        branch._id === id ? { ...branch, ...updatedBranch } : branch
      )
    );
  };
  

  return (
    <main className="min-w-full min-h-full mx-auto   bg-white ">
      <InfoHeaderComponent
        route={"All Branches"}
        links={breadcrumbsLinks}
        title="Add branch"
        onClick={onClick}
      />
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4 bg-white shadow-lg"></div>
      <Suspense fallback={<LoadingDivs />}>
        <div className="p-10">
          <BranchList
            branches={branches}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            editBranch={editBranch}
          />
        </div>
      </Suspense>
    </main>
  );
};

export default AllBranches;
