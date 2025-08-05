import React from "react";
import Modal from "../Modal";
import { Schedule } from "./Schedules";
import { formatCurrency, formatDate } from "@/app/lib/helperFunctions";
import { IoIosArrowRoundForward } from "react-icons/io";

interface ArrearsPaymentSchedule {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  amount: number;
  setAmount: (amount: number | undefined) => void;
  selectedSchedule: Schedule;
  loan: {
    systemId: string;
    client: {
      first_name: string;
      last_name: string;
      systemId: string;
    };
  };

  handleArrearsPayment: (
    amount: number,
    loadId: string,
    nextPayment: string,
    clientId: string
  ) => void;
}
const ArrearsPaymentModal = ({
  modalOpen,
  setModalOpen,
  amount,
  setAmount,
  loan,
  selectedSchedule,
  handleArrearsPayment,
}: ArrearsPaymentSchedule) => {
  return (
    <Modal
      setModalOpen={setModalOpen}
      modalOpen={modalOpen}
      onClose={() => setAmount(undefined)}
    >
      <section className="p-3 w-full">
        <div className="w-full flex flex-col gap-5 bg-white rounded-md p-2">
          <h1 className="uppercase font-mono font-semibold text-xl">
            Check Out Details
          </h1>
          <p className="font-sans text-sm text-gray-700 p-2">
            Client Name:{" "}
            <span className="text-gray-500 font-bold">
              {loan.client.first_name} {loan.client.last_name}
            </span>
          </p>
          <p className="font-sans text-sm text-gray-700 p-2">
            Amount to Pay:{" "}
            <span className="text-gray-500 font-bold">
              {formatCurrency(selectedSchedule.outStandingBalance)}
            </span>
          </p>
          <p className="font-sans text-sm text-gray-700 p-2">
            Payment Date:{" "}
            <span className="text-gray-500 font-bold">
              {formatDate(selectedSchedule.nextPayment)}
            </span>
          </p>
          <p className="font-sans text-sm text-gray-700 p-2">
            Week:{" "}
            <span className="text-gray-500 font-bold">
              {selectedSchedule.week}
            </span>
          </p>
          <input
            autoFocus
            type="number"
            placeholder="Enter Amount to Pay"
            className="text-sm font-sans w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={amount ?? ""}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
          <button
            className="btn btn-sm disabled:bg-gray-300 glass bg-violet-500 text-slate-100 flex items-center justify-center gap-3"
            disabled={isNaN(amount ?? 0) || (amount ?? 0) <= 0}
            onClick={() =>
              handleArrearsPayment(
                Number(amount),
                loan.systemId,
                loan.client.systemId,
                selectedSchedule.nextPayment
              )
            }
          >
            Proceed{" "}
            <IoIosArrowRoundForward
              size={25}
              className="relative icon-move-left"
            />
          </button>
        </div>
      </section>
    </Modal>
  );
};

export default ArrearsPaymentModal;
