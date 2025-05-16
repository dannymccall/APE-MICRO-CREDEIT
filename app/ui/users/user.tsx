"use client";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiEditBoxLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from "@/app/component/Modal";
import { IUser } from "@/app/lib/backend/models/user.model";
import { MdViewCompact } from "react-icons/md";
import { BsQuestionCircleFill } from "react-icons/bs";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import ViewUser from "./View";

interface UserProps {
  user: IUser;
  onDelete: () => void;
  editUser: () => void;
}

const User: React.FC<UserProps> = ({ user, onDelete, editUser }) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const router = useRouter();

  async function deleteUser(id: string | any) {
    const response = await makeRequest(`/api/users?id=${id}`, {
      method: "DELETE",
    });

    const { success, message } = response;
    let timeout: NodeJS.Timeout;

    if (success) {
      setShowToast(true);
      timeout = setTimeout(() => {
        setShowToast(false);
        router.refresh();
      }, 3000);
      setOpenModalDeleted(false);
      onDelete();
    }

    return () => clearTimeout(timeout);
  }

  return (
    <>
      {showToast && (
        <Toast
          message={"User deleted successfully"}
          Icon={FaCircleCheck}
          title="User Deletion Response"
        />
      )}

      <tr key={user.id} className="hover:bg-gray-100 relative">
        <td className="p-2">{user.first_name}</td>
        <td className="p-2">{user.last_name}</td>
        <td className="p-2">{user.other_names}</td>
        <td className="p-2">
          {user.sex.charAt(0).toUpperCase() + user.sex.slice(1).toLowerCase()}
        </td>
        <td className="p-2">{user.roles.join(", ")}</td>
        <td className="p-2">{user.username}</td>
        <td className="p-2">
          <section className="flex flex-row gap-2 items-center">
            <span
              className={`w-2 h-2 ${
                user.online_status === "online" ? "bg-green-700" : "bg-red-700"
              } rounded-full`}
            ></span>
            {user.online_status}
          </section>
        </td>
        <td className="p-2 relative flex flex-row gap-3 items-center">
          <div className="tooltip" data-tip="View">
            <button
              role="menuitem"
              className=" text-left flex flex-row gap-3"
              onClick={() => {
                setEditForm(false);
                setOpenModalEdit(true);
              }}
            >
              <MdViewCompact
                size={20}
                className="text-violet-800 font-semibold"
              />
            </button>
          </div>
          <div className="tooltip" data-tip="Edit">
            <button
              role="menuitem"
              className=" text-left flex flex-row gap-3"
              onClick={() => {
                setEditForm(true);
                setOpenModalEdit(true);
              }}
            >
              <RiEditBoxLine
                size={20}
                className="text-blue-800 font-semibold"
              />
            </button>
          </div>
          <div className="tooltip" data-tip="Delete">
            <button
              role="menuitem"
              className="text-left flex flex-row gap-3"
              onClick={() => setOpenModalDeleted(true)}
            >
              <RiDeleteBin6Line
                size={20}
                className="font-semibold text-red-800"
              />
            </button>
          </div>

          <Modal
            modalOpen={openModalDeleted}
            setModalOpen={setOpenModalDeleted}
          >
            <section className="w-full h-full flex flex-col items-center justify-center gap-2">
              <section className="w-full h-full flex gap-1 items-center">
                <h1 className="text-lg font-sans font-semibold">Question</h1>
                <BsQuestionCircleFill className="text-red-500" />
              </section>

              <h1 className="font-sans">
                Are you sure you want to delete this user:{" "}
                <strong>{user.username}</strong>
              </h1>

              <div className="flex gap-2 mt-3">
                <button
                  className="btn btn-primary w-16 h-7"
                  onClick={() => deleteUser(user._id)}
                >
                  YES
                </button>
                <button
                  className="btn btn-error text-white"
                  onClick={() => setOpenModalDeleted(false)}
                >
                  NO
                </button>
              </div>
            </section>
          </Modal>
          <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
            <ViewUser
              user={user}
              editForm={editForm}
              setEditForm={setEditForm}
              editUser={editUser}
              setOpenModalEdit={setOpenModalEdit}
            />
          </Modal>
        </td>
      </tr>
    </>
  );
};

export default User;
