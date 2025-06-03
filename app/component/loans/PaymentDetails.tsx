"use client";

import React, { useState } from "react";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import {
  formatCurrency,
  formatDate,
  makeRequest,
  processFormSubmissions,
} from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../../api/Loaders/Loading";
import { useLogginIdentity } from "@/app/lib/customHooks";

export interface PaymentClientDetails {
  client: {
    first_name: string;
    last_name: string;
    systemId: string;
    _id: string;
    loans: Array<{
      weeklyAmount: number;
      nextPayment: Date;
      systemId: string;
      _id: string;
    }>;
  };
}

export type TPaymentDetails = {
  amount: number;
  loanId: string;
  clientId: string;
  nextPayment: string;
};
const ClientDetails: React.FC<PaymentClientDetails> = ({ client }) => {
  const [formData, setFormData] = useState<
    Record<number, { amount: string; loanId: string; nextPayment: string }>
  >({});
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<{
    showMessage: boolean;
    message: string;
    messageType: string;
  }>({ showMessage: false, message: "", messageType: "" });
  const [pending, setPending] = useState<boolean>(false);
  const logginIdentity = useLogginIdentity();
  const handleInputChange = (index: number, field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [Number(index)]: {
        ...prevState[index],
        [field]: value,
      },
    }));

  };

  const handleSubmitAll = async () => {
    {
      formData;
    }
    await processFormSubmissions(
      "/api/payments",
      setPending,
      setSuccessMessage,
      makeRequest,
      logginIdentity
    );
  };

  const buttonClasses = `btn btn-sm h-4 mt-5 ml-5 flex flex-row items-center ${
    pending ? "w-52 text-slate-100" : "w-24 text-black"
  } rounded-md justify-center gap-3 bg-slate-200 hover:from-violet-700 hover:to-violet-900 font-bold font-sans transition`;

  return (
    <>
      {successMessage.showMessage && (
        <h1
          className={`font-mono ${
            successMessage.messageType === "errMessage"
              ? "background: bg-red-200 text-red-600 border-red-700"
              : "background: bg-green-200 text-green-600 border-green-700"
          }   border-2 p-3 my-5 max-w-2xl rounded-md`}
        >
          {successMessage.message}
        </h1>
      )}

      <div
        className={`flex flex-row max-w-2xl bg-slate-200 mt-5 rounded transition-all duration-300 ease-in-out ${
          client ? "h-96" : "h-0"
        } overflow-hidden`}
      >
        {
          client && (

        <div className="w-full flex flex-col  bg-[url('../public/checkout.jpg')] bg-cover bg-center py-4 overflow-y-auto">
          <div className="w-full h-full flex flex-col justify-evenly">
            <div className="w-full flex desktop:flex-row laptop:flex-row tablet:flex-row phone:flex-col mb-2 justify-between desktop:items-center laptop:items-center tablet:items-center phone:items-start px-5">
              <p className="text-base font-mono text-slate-100">
                APPLICANT NAME
              </p>
              <span className="text-xl font-mono text-slate-100">
                {client.first_name} {client.last_name}
              </span>
            </div>
            <h1 className="ml-5 text-xl font-mono text-amber-500">
              LOANS ACQUIRED
            </h1>
            {client.loans ? client.loans.map((loan, index) => (
              <div className="w-full border-b py-2" key={index}>
                <div className="w-full flex desktop:flex-row laptop:flex-row tablet:flex-row phone:flex-col mb-2 justify-between desktop:items-center laptop:items-center tablet:items-center phone:items-start  px-5">
                  <p className="text-base font-mono text-slate-100">
                    WEEKLY AMOUNT
                  </p>
                  <span className="text-base font-mono text-amber-500">
                   {formatCurrency(loan.weeklyAmount)}
                  </span>
                </div>
                <div className="w-full flex desktop:flex-row laptop:flex-row tablet:flex-row phone:flex-col gap-1 mb-2  justify-between desktop:items-center laptop:items-center tablet:items-center phone:items-start  px-5">
                  <p className="text-base font-mono text-slate-100">
                    NEXT PAYMENT DATE
                  </p>

                  <span className="text-sm font-mono  text-amber-500">
                    {formatDate(loan.nextPayment)}
                  </span>
                </div>

                <form
                  className="w-full h-full flex flex-col  px-5"
                  id="single-payment-form"
                >
                  <div className="flex flex-row gap-2 justify-between mb-2 desktop:flex-row laptop:flex-row tablet:flex-row phone:flex-col">
                    <div className="flex flex-row w-32 gap-0 items-center">
                      <Label
                        className="font-sans font-semibold text-white"
                        labelName="Enter Amount"
                      />
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                    <input
                      type="number"
                      className="block text-sm w-56 px-5 text-white py-2 border-2 bg-transparent border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-violet-300 focus:border-violet-400 sm:text-sm"
                      placeholder="Amount"
                      name="amount"
                      value={formData[index]?.amount || ""}
                      onChange={(e) =>
                        handleInputChange(index, "amount", e.target.value)
                      }
                    />
                    <input
                      type="hidden"
                      name="nextPayment"
                      defaultValue={String(loan.nextPayment)}
                    />
                    <input
                      type="hidden"
                      name="loanId"
                      defaultValue={loan.systemId}
                    />
                    <input
                      type="hidden"
                      name="clientId"
                      defaultValue={client.systemId}
                    />
                  </div>
                </form>
              </div>
            )):""}
          </div>
          <button
            className={buttonClasses}
            type="button"
            form="single-payment-form"
            onClick={handleSubmitAll}
            disabled={pending}
            aria-busy={pending}
            
          >
            {pending ? (
              <>
                <LoadingSpinner />
                Proccessing
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
          )
        }
      </div>
    </>
  );
};

export default ClientDetails;
