"use client";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiEditBoxLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from "@/app/component/Modal";
import { IBranch } from "@/app/lib/backend/models/branch.model";
import { MdViewCompact } from "react-icons/md";
import { BsQuestionCircleFill } from "react-icons/bs";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import ViewBranch from "./View";

interface UserProps {
  branch: IBranch;
  onDelete: () => void;
  editBranch: (branch: IBranch, id: string) => void;
}

const Branch: React.FC<UserProps> = ({ branch, onDelete, editBranch }) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const router = useRouter();

  async function deleteBranch(id: string | any) {
    const response = await makeRequest(`/api/branches?id=${id}`, {
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

      <tr key={branch.id} className="hover:bg-gray-100 relative w-full">
        <td className="p-2 text-sm">{branch.branchName}</td>
        <td className="p-2 text-sm">{branch.branchCode}</td>

        <td className="p-2 text-sm relative flex gap-3">
          <button
            role="menuitem"
            className="text-left flex flex-row gap-3"
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

          <button
            role="menuitem"
            className=" text-left flex flex-row gap-3"
            onClick={() => {
              setEditForm(true);
              setOpenModalEdit(true);
            }}
          >
            <RiEditBoxLine size={20} className="text-blue-800 font-semibold" />
     
          </button>

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
                Are you sure you want to delete this branch:{" "}
                <strong>{branch.branchName}</strong>
              </h1>

              <section className="flex gap-2 mt-3">
                <button
                  className="btn btn-primary w-16 h-7"
                  onClick={() => deleteBranch(branch._id)}
                >
                  YES
                </button>
                <button
                  className="btn btn-error text-white"
                  onClick={() => setOpenModalDeleted(false)}
                >
                  NO
                </button>
              </section>
            </section>
          </Modal>
          <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
            <ViewBranch
              branch={branch}
              editForm={editForm}
              setEditForm={setEditForm}
              editBranch={editBranch}
              setOpenModalEdit={setOpenModalEdit}
            />
          </Modal>
        </td>
      </tr>
    </>
  );
};

export default Branch;
