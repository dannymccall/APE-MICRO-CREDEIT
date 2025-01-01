"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeRequest } from "@/app/lib/utils";
import { IUser } from "@/app/lib/backend/models/user.model";
// import UsersList from "./usersList";
import { useRouter } from "next/navigation";

const UsersList = lazy(() => import("./usersList"));

import { LoadingDivs } from "@/app/component/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
const AllUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchUsers() {
    try {
      const users: any = await makeRequest(
        `api/users?page=${currentPage}&limit=${10}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      setUsers(users.data);
      setTotalPages(users.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  const handleDelete = () => {
    fetchUsers();
  };
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);
  const router = useRouter();

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "manage-staff",
      href: "/manage-user",
    },
  ];

  const onClick = () => router.push("/addUser");

  const editUser = (updatedUser: any, id: string) => {
    console.log({updatedUser, id})
    if(id === updatedUser._id)console.log("correct")
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, ...updatedUser } : user
      )
    );
    console.log(users)
  };
  

  return (
    <main className="min-w-full min-h-full mx-auto   bg-white ">
      <InfoHeaderComponent
        route={"All staff"}
        links={breadcrumbsLinks}
        title="Add staff"
        onClick={onClick}
      />
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4 bg-white shadow-lg"></div>
      <Suspense fallback={<LoadingDivs />}>
        <div className="p-10">
          <UsersList
            users={users}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            editUser={editUser}
          />
        </div>
      </Suspense>
    </main>
  );
};

export default AllUsers;
