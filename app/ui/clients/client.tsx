"use client";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiEditBoxLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from "@/app/component/Modal";
import { IClient } from "@/app/lib/backend/models/client.model";
import { MdViewCompact } from "react-icons/md";
import { BsQuestionCircleFill } from "react-icons/bs";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import ViewUser from "./View";
import Link from "next/link";
import EditClient from "./editClient";

interface ClientProps {
  client: IClient | any;
  onDelete: () => void;
  editClient: (client: IClient, id: string) => void;
}

const Client: React.FC<ClientProps> = ({ client, onDelete, editClient }) => {
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const router = useRouter();

  async function deleteClient(id: string | any) {
    const response = await makeRequest(`/api/clients?id=${id}`, {
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

      <tr key={client.id} className="hover:bg-gray-100 relative">
        <td className="p-2 text-sm">{client.systemId}</td>
        <td className="p-2 text-sm">
          {client.first_name} {client.last_name}
        </td>
        <td className="p-2 text-sm">
          {client.gender.charAt(0).toUpperCase() +
            client.gender.slice(1).toLowerCase()}
        </td>
        <td className="p-2 text-sm">{client.mobile}</td>
        <td className="p-2 text-sm">
          {client.client_status === "in-active" ? "In Active" : "Active"}
        </td>
        <td className="p-2 text-sm">
          {" "}
          {client.branch.branchName || "No Branch"}
        </td>
        <td className="p-2 text-sm">
          {" "}
          {client.staff.first_name || "No Staff"}{" "}
        </td>

        <td className="p-2 w-full text-sm relative flex flex-row gap-3 items-center h-full">
          <div className="tooltip" data-tip="View">
            <Link
              role="menuitem"
              className="text-left flex flex-row gap-3"
              href={`/view-client/${client.systemId}`}
            >
              <MdViewCompact
                size={20}
                className="text-violet-800 font-semibold"
              />
            </Link>
          </div>

          <div className="tooltip" data-tip="Edit">
            <button
              role="menuitem"
              className="text-left flex flex-row gap-3"
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
            <section className="w-full h-full flex flex-col gap-2">
              <section className="w-full h-full flex gap-1 items-center">
                <h1 className="text-lg font-sans font-semibold">Question</h1>
                <BsQuestionCircleFill className="text-red-500" />
              </section>

              <h1 className="font-sans">
                Are you sure you want to delete this client:{" "}
                <strong>
                  {client.first_name} {client.last_name}
                </strong>
              </h1>

              <div className="flex gap-2 mt-3">
                <button
                  className="btn btn-primary w-16 h-7"
                  onClick={() => deleteClient(client._id)}
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
          <Modal
            modalOpen={openModalEdit}
            setModalOpen={setOpenModalEdit}
            width="max-w-3xl"
          >
            <EditClient setOpenModalEdit={setOpenModalEdit} client={client} />
          </Modal>
        </td>
      </tr>
    </>
  );
};

export default Client;
