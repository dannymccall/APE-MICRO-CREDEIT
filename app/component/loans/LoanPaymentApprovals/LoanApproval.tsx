"use client";
import React, { useState } from "react";
import Modal from "@/app/component/Modal";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { formatDate, makeRequest } from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import { RiEditBoxLine } from "react-icons/ri";
import { IoIosCheckmark } from "react-icons/io";
import { useLogginIdentity } from "@/app/lib/customHooks";

export interface LoanApprovalProps {
  pendingLoan: {
    _id: string;
    weeklyAmountExpected: number;
    amountPaid: number;
    paymentDate: string;
    client: {
      _id: string;
      first_name: string;
      last_name: string;
      systemId: "string";
    };
    loan: {
      _id: string;
      systemId: string;
      nextPayment: Date;
      weeklyAmount: number;
    };

  };
  onApprove: () => void
}

const LoanApproval: React.FC<LoanApprovalProps> = ({ pendingLoan, onApprove }) => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("")
   const logginIdentity:{fullName: string, userName: string, userRoles: string} = useLogginIdentity();
  const router = useRouter();

  const handleApprove = async (pendingLoan: string, loanId: string) => {
    const res = await makeRequest(
      `/api/loanPaymentApprovals?pendingLoanId=${pendingLoan}&loanId=${loanId}`,
      { method: "POST" }
    );

    const { success, message } = res;
    if (success) {
      onApprove()
      setShowToast(true);
      setOpenModalEdit(false);
      setMessage(message)
      let timeOut: NodeJS.Timeout;
      timeOut = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timeOut);
    }
  };
  return (
    <>
      {showToast && (
        <Toast
          message={message}
          Icon={FaCircleCheck}
          title="User Deletion Response"
        />
      )}

      <tr key={pendingLoan._id} className="hover:bg-gray-100 relative">
        <td className="p-2 text-sm">
          {pendingLoan.client.first_name} {pendingLoan.client.last_name}
        </td>
        <td className="p-2 text-sm">
          {formatDate(pendingLoan.loan.nextPayment)}
        </td>
        <td className="p-2">
          GHS {Number(pendingLoan.weeklyAmountExpected).toFixed(2)}
        </td>
        <td className="p-2 text-sm">
          GHS {Number(pendingLoan.amountPaid).toFixed(2)}
        </td>
        
        <td className="p-2 text-sm">
          <section
            className="dropdown flex items-center h-full relative"
            style={{ height: "100%" }}
          >
            <button
              role="menuitem"
              className="text-left flex flex-row gap-1 bg-violet-700 text-white p-1 rounded-md"
              onClick={() => {
                setOpenModalEdit(true);
              }}
            >
              <IoIosCheckmark
                size={20}
                className="text-white font-semibold text-lg"
              />
              Approve
            </button>
            <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
              <h1 className="text-red-500 font-semibold">Are you sure you want to approval this payment ?</h1>
              <section className="flex gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    handleApprove(pendingLoan._id, pendingLoan.loan._id)
                  }
                >
                  YES
                </button>
                <button
                  onClick={() => setOpenModalEdit(false)}
                  className="btn btn-secondary"
                >
                  NO
                </button>
              </section>
            </Modal>
          </section>
        </td>
      </tr>
    </>
  );
};

export default LoanApproval;
