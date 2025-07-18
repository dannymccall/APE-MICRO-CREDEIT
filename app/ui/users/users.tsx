"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeRequest } from "@/app/lib/helperFunctions";
import { IUser } from "@/app/lib/backend/models/user.model";
// import UsersList from "./usersList";
import { useRouter } from "next/navigation";

const UsersList = lazy(() => import("./usersList"));

import { LoadingDivs } from "@/app/component/Loaders/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import SearchInput from "@/app/component/Search/SearchInput";
import { useSearch } from "@/app/lib/customHooks";
import TableSkeletonLoader from "@/app/component/TableSkeletonLoader";
const AllUsers = () => {
  // const [users, setUsers] = useState<IUser[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [loading, setLoading] = useState<boolean>(true);
  // async function fetchUsers() {
  //   try {
  //     const users: any = await makeRequest(
  //       `api/users?page=${currentPage}&limit=${10}`,
  //       {
  //         method: "GET",
  //         cache: "no-store",
  //       }
  //     );
  //     setUsers(users.users);
  //     setTotalPages(users.pagination.totalPages);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Failed to fetch users:", error);
  //   }
  // }

  // const handleDelete = () => {
  //   fetchUsers();
  // };
  // useEffect(() => {
  //   fetchUsers();
  // }, [currentPage]);
  const {
    data: users,
    loading,
    query,
    handleSearch,
    totalPages,
    currentPage,
    setCurrentPage,
    response,
    refresh,
    setQuery
  } = useSearch<IUser>({
    endpoint: "api/users",
    initialPage: 1,
    limit: 10,
  });

  const router = useRouter();

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "manage-staff",
      href: "/manage-user",
    },
  ];

  const onClick = () => router.push("/addUser");

  // const editUser = () => {
  //   fetchUsers();
  // };

    function handleFetchAll(): void {
    setQuery("")
    refresh()
  }

  return (
    <main className="min-w-full min-h-full mx-auto">
      <InfoHeaderComponent
        route={"All Staff"}
        links={breadcrumbsLinks}
        title="Add Staff"
        onClick={onClick}
      />
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4 bg-white"></div>
      {loading ? (
        <>
          <TableSkeletonLoader />
       
        </>
      ) : (
        <Suspense fallback={<TableSkeletonLoader />}>
          <div className="p-10">
            {(users.length > 0 || query) && (
              <SearchInput
                handleOnclickSearch={handleSearch}
                placeholder="Search users..."
                fetchAll={handleFetchAll}
                buttonLabel="Users"
              />
            )}
            {users.length > 0 ? (
              <UsersList
                users={users}
                onDelete={refresh}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                editUser={refresh}
              />
            ) : (
              <div className="text-center text-gray-500">{response}</div>
            )}
          </div>
        </Suspense>
      )}
    </main>
  );
};

export default AllUsers;
