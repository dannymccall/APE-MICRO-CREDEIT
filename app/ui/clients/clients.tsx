"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeRequest } from "@/app/lib/utils";
import { IClient } from "@/app/lib/backend/models/client.model";
// import UsersList from "./usersList";
import { useRouter } from "next/navigation";

const ClientList = lazy(() => import("./clientList"));

import { LoadingDivs } from "@/app/component/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
const AllClients = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchUsers() {
    try {
      const clients: any = await makeRequest(
        `api/clients?page=${currentPage}&limit=${10}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      setClients(clients.data);
      setTotalPages(clients.pagination.totalPages);
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
      name: "manage-client",
      href: "/manage-client",
    },
  ];

  const onClick = () => router.push("/add-client");

  const editClient = (updatedUser: any, id: string) => {
    // console.log({updatedUser, id})
    // if(id === updatedUser._id)console.log("correct")
    // setUsers((prevUsers) =>
    //   prevUsers.map((user) =>
    //     user._id === id ? { ...user, ...updatedUser } : user
    //   )
    // );
    // console.log(users)
  };
  

  return (
    <main className="min-w-full min-h-full mx-auto   bg-white ">
      <InfoHeaderComponent
        route={"All clients"}
        links={breadcrumbsLinks}
        title="Add client"
        onClick={onClick}
      />
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4 bg-white shadow-lg"></div>
      <Suspense fallback={<LoadingDivs />}>
        <div className="p-10">
          <ClientList
            clients={clients}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            editClient={editClient}
          />
        </div>
      </Suspense>
    </main>
  );
};

export default AllClients;
