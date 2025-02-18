"use client";
import React, { useState } from "react";

import Modal from "@/app/component/Modal";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { makeRequest, toCapitalized } from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import { ILoanApplication } from "@/app/lib/backend/models/loans.model";
import { FcApprove } from "react-icons/fc";

import Link from "next/link";
import {
  RiArrowDropDownFill,
  RiDeleteBin6Line,
  RiEditBoxLine,
} from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdViewCompact } from "react-icons/md";
import { BsQuestionCircleFill } from "react-icons/bs";

interface LoanProps {
  loan: ILoanApplication | any;
}

const Loan: React.FC<LoanProps> = ({ loan }) => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [openApprodalModal, setOpenApprodalModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const approveLoan = async (loanId: string) => {
    const response = await makeRequest(
      `/api/loans?_id=${loanId}&approveLoan=${true}`,
      { method: "PUT" }
    );
    console.log(response);
    const { success, message } = response;
    if (success) {
      setOpenApprodalModal(false);
      setShowToast(true);
      setMessage(message);
      let timeOut: NodeJS.Timeout;
      
      timeOut = setTimeout(() => {
        window.location.reload();
        setShowToast(false);
      }, 1000);

      return () => clearTimeout(timeOut);
    }
  };


  const deleteLoan = async(loanId:string) => {
    const response = await makeRequest(`/api/loans?_id=${loanId}`,{method: "DELETE"});
    const { success, message } = response;
    if (success) {
      setOpenModalDeleted(false);
      setShowToast(true);
      setMessage(message);
      let timeOut: NodeJS.Timeout;

      timeOut = setTimeout(() => {
        setShowToast(false);
        window.location.reload();

      }, 1000);

      return () => clearTimeout(timeOut);
    }
  }
  return (
    <>
      {showToast && <Toast message={message} Icon={FaCircleCheck} title="" />}

      <tr key={loan.id} className="hover:bg-gray-100 relative">
        <td className="p-2 text-sm">{loan.systemId}</td>
        <td className="p-2 text-sm">{loan.loanProduct}</td>
        <td className="p-2 text-sm">GHS {Number(loan.principal).toFixed(2)}</td>
        <td className="p-2 text-sm">{`${loan.client.first_name}  ${loan.client.last_name}`}</td>
        <td className="p-2 text-sm">{`${loan.loanOfficer.first_name}  ${loan.loanOfficer.other_names} ${loan.loanOfficer.last_name}`}</td>
        <td className="p-2 text-sm"> {loan.monthlyInterest}</td>
        <td className="p-2 text-sm">
          {" "}
          <span
            className={`${
              loan.paymentStatus === "not completed"
                ? "bg-orange-200"
                : loan.paymentStatus === "completed"
                ? "bg-green-200"
                : "bg-red-200"
            } p-1 rounded`}
          >
            {" "}
            {toCapitalized(loan.paymentStatus)}
          </span>{" "}
        </td>
        <td className="p-2 text-sm">
          {" "}
          <span
            className={`${
              loan.loanApprovalStatus === "Pending"
                ? "bg-red-200"
                : "bg-green-200"
            } p-1 rounded`}
          >
            {loan.loanApprovalStatus}
          </span>{" "}
        </td>

        <td className="p-2 text-sm relative">
            <button
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={openDropdown}
              className="border-2 border-violet-500 px-2 py-1 flex items-center gap-1 cursor-pointer h-full rounded"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              <HiOutlineDotsHorizontal size={25} className="text-violet-700" />
              <RiArrowDropDownFill size={25} className="text-violet-700" />
            </button>

            {openDropdown && (
              <ul
                tabIndex={0}
                role="menu"
                className="dropdown-content menu absolute right-0 bg-white rounded z-10 w-32 p-2 shadow-lg"
                style={{ top: "100%" }}
              >
                <li>
                  <Link
                    role="menuitem"
                    className="w-full text-left flex flex-row gap-3"
                    href={`/view-loan/${loan.systemId}`}
                    onClick={() => {
                      // setEditForm(false);
                      // setOpenModalEdit(true);
                    }}
                  >
                    <MdViewCompact
                      size={20}
                      className="text-violet-800 font-semibold"
                    />
                    View
                  </Link>
                </li>
                <li>
                  <button
                    role="menuitem"
                    className="w-full text-left flex flex-row gap-3"
                    onClick={() => {
                      // setEditForm(true);
                      setOpenModalEdit(true);
                    }}
                  >
                    <RiEditBoxLine
                      size={20}
                      className="text-blue-800 font-semibold"
                    />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    role="menuitem"
                    className="w-full text-left flex flex-row gap-3"
                    onClick={() => setOpenModalDeleted(true)}
                  >
                    <RiDeleteBin6Line
                      size={20}
                      className="font-semibold text-red-800"
                    />
                    Delete
                  </button>
                </li>
                {loan.loanApprovalStatus === "Pending" && (
                  <li>
                    <button
                      role="menuitem"
                      className="w-full text-left flex flex-row gap-3"
                      onClick={() => setOpenApprodalModal(true)}
                    >
                      <FcApprove
                        size={20}
                        className="font-semibold text-red-800"
                      />
                      Approve
                    </button>
                  </li>
                )}
              </ul>
            )}
          {/*</section>*/}

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
                Are you sure you want to delete this loan application:{" "}
                <strong>{loan.systemId}</strong>
              </h1>

              <section className="flex gap-2 mt-3">
                <button
                  className="btn btn-primary w-16 h-7"
                  onClick={() => deleteLoan(loan._id)}
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
          <Modal
            modalOpen={openApprodalModal}
            setModalOpen={setOpenApprodalModal}
          >
            <section className="w-full h-full flex flex-col gap-2">
              <section className="w-full h-full flex gap-1 items-center">
                <h1 className="text-lg font-sans font-semibold">Question</h1>
                <BsQuestionCircleFill className="text-red-500" />
              </section>

              <h1 className="font-sans">
                Are you sure you want to approve this loan application:{" "}
                <strong>{loan.systemId}</strong>
              </h1>

              <section className="flex gap-2 mt-3">
                <button
                  className="btn btn-primary w-16 h-7"
                  onClick={() => approveLoan(loan._id)}
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
            {/* <ViewUser
              user={user}
              editForm={editForm}
              setEditForm={setEditForm}
              editUser={editUser}
              setOpenModalEdit={setOpenModalEdit}
            /> */}
          </Modal>
        </td>
      </tr>
    </>
  );
};

export default Loan;
