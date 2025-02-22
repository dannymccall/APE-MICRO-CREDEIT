"use client";

import React from "react";
import Client from "./client";
import { IClient } from "@/app/lib/backend/models/client.model";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { IoCaretForward } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";

interface ClientListProps {
  clients: IClient[];
  onDelete: () => void;
  currentPage?: number;
  totalPages: number | 1;
  setCurrentPage: (page: number) => void;
  editClient: (client: IClient, id: string) => void,
}
const ClientList: React.FC<ClientListProps> = ({
  clients,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  editClient
}) => {
  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "add-user",
      href: "/addUser",
    },
  ];

  return (
    <div className="w-full overflow-x-auto bg-white">
      <div className="w-full h-full bg-white relative">
        <table className="table">
          {/* head */}
          <thead className="relative">
            <tr className="relative bg-violet-200">
              <th className="text-base font-sans font-medium text-gray-700 text-left p-2">
                System ID
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Full Name
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Gender
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Mobile
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Status
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Branch
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Staff
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Actions{" "}
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {clients.map((client: IClient | any) => (
              <Client key={client._id} client={client}  onDelete={onDelete} editClient={() => {}} />
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-4 p-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage(Math.max((currentPage ?? 1) - 1, 1))
            }
            disabled={currentPage === 1}
          >
            <IoCaretBackSharp className="text-violet-700" />
          </button>
          <span className="font-semibold font-sans">
            Page {currentPage ?? 1} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage(Math.min((currentPage ?? 1) + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <IoCaretForward className="text-violet-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
