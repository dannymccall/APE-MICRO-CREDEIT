"use client";

import React from "react";
import User from "@/app/ui/users/user";
import { IUser } from "@/app/lib/backend/models/user.model";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { IoCaretForward } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";

interface UserListProps {
  users: IUser[];
  onDelete: () => void;
  currentPage?: number;
  totalPages: number | 1;
  setCurrentPage: (page: number) => void;
  editUser: () => void,
}
const UsersList: React.FC<UserListProps> = ({
  users,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  editUser
}) => {
 
  return (
    <div className="bg-white w-full">
      <div className="w-full h-full bg-white relative">
        <table className="table">
          {/* head */}
          <thead className="relative">
            <tr className="relative bg-violet-200">
              <th className="text-base font-sans font-medium text-gray-700 text-left p-2">
                First Name
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Last Name
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Other Names
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Sex
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Roles
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Username
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Online Status
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Actions{" "}
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {users.map((user: IUser | any) => (
              <User key={user._id} user={user} onDelete={onDelete} editUser={editUser} />
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
            Page {currentPage} of {totalPages}
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

export default UsersList;
