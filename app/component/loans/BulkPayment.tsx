import React, { useState } from "react";
import { IClient } from "@/app/lib/backend/models/client.model";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import {
  formatCurrency,
  formatDate,
  makeRequest,
  processFormSubmissions,
} from "@/app/lib/helperFunctions";
import { useLogginIdentity } from "@/app/lib/customHooks";

export interface PaymentClientDetails {
  loans: Array<{
    weeklyAmount: number;
    nextPayment: Date;
    systemId: string;
    _id: string;
    client: {
      first_name: string;
      last_name: string;
      systemId: string;
      _id: string;
    };
  }>;
}
const BulkPayment: React.FC<PaymentClientDetails> = ({ loans }) => {
  const [formData, setFormData] = useState<Record<number, { amount: string }>>(
    {}
  );
  const [successMessage, setSuccessMessage] = useState<{
    showMessage: boolean;
    message: string;
    messageType: string;
  }>({ showMessage: false, message: "", messageType: "" });
  const [pending, setPending] = useState<boolean>(false);
  const logginIdentity = useLogginIdentity()
  // const handleSubmit = (event: React.FormEvent, index: number) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.target as HTMLFormElement);
  //   const amount = formData.get("amount");

  //   console.log(`Form #${index} submitted with amount: ${amount}`);
  //   // Add logic to process this form submission
  // };

  const handleInputChange = (index: number, field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        [field]: value,
      },
    }));
  };
  // const handleClick = () => {
  //   const forms = document.querySelectorAll("form");
  //   forms.forEach((form, index) => {
  //     const formData = new FormData(form as HTMLFormElement);
  //     const amount = formData.get("amount");
  //     console.log(`Processing form #${index} with amount: ${amount}`);
  //   });
  // };

  // Submit all forms
  const handleSubmitAll = async () => {
    await processFormSubmissions(
      "/api/payments",
      setPending,
      setSuccessMessage,
      makeRequest,
      logginIdentity
    );
    // try {
    //   // await processLoan({ payments: formData });
    //   console.log("All payments submitted:", formData);
    //   setFormData({});
    // } catch (error) {
    //   console.error("Error submitting payments:", error);
    // }
  };

  return (
    <>
      {successMessage.showMessage && (
        <h1
          className={`font-mono ${
            successMessage.messageType === "errMessage"
              ? "background: bg-red-200 text-red-600 border-red-700"
              : "background: bg-green-200 text-green-600 border-green-700"
          }   border-2 p-3 my-5 max-w-xl rounded-md text-center m-auto`}
        >
          {successMessage.message}
        </h1>
      )}
      <div className="w-full flex gap-10 flex-wrap item-center justify-center">
        {loans && Array.isArray(loans) && loans.length > 0 ? loans.map((loan, index: number) => (
          <div
            className="max-w-80 gap-5 flex flex-col bg-[url('../public/checkout.jpg')] bg-cover bg-center rounded-md"
            key={index}
          >
            <div className="h-full gap-5 flex flex-col justify-evenly mt-5 w-72">
              <div className="w-full flex gap-1 flex-col ml-5">
                <p className="text-Base font-mono text-slate-50">NAME</p>
                <span className="w-full text-xl font-mono text-amber-500">
                  {loan.client.first_name} {loan.client.last_name}
                </span>
              </div>
              <div className="w-full flex gap-1 flex-col ml-5">
                <p className="text-Base font-mono text-slate-50">TOTAL</p>
                <span className="w-full text-xl font-mono text-amber-500">
                  {formatCurrency(loan.weeklyAmount)}
                </span>
              </div>
              <div className="w-full flex gap-1 flex-col ml-5">
                <p className="text-Base font-mono text-slate-50">DATE</p>
                <span className="w-full text-xl font-mono text-amber-500">
                  {formatDate(loan.nextPayment)}
                </span>
              </div>
            </div>
            <form
              className="w-full h-full flex items-center ml-5"
              id="bulk-payment-form"
              // onSubmit={(event) => handleSubmit(event, index)}
            >
              <div className="flex flex-col gap-2 my-5 justify-center">
                <div className="flex flex-row w-32 gap-0 items-center">
                  <Label
                    className="font-sans font-semibold text-white"
                    labelName="Enter Amount"
                  />
                  <span className="text-red-500 ml-1">*</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  className="block text-sm w-64 px-5 text-white py-2 border-2 bg-transparent border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-violet-300 focus:border-violet-400 sm:text-sm"
                  placeholder="Enter Amount"
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
                  defaultValue={loan.client.systemId}
                />
              </div>
            </form>
          </div>
        )): <h1>No Bulk Payments availble for today.</h1>}
        {/* A global button to process all forms */}
      </div>
      {
        loans && Array.isArray(loans) && loans.length > 0 && 
      <button
        type="button"
        className="btn w-40 h-10 mx-auto mt-5 flex items-center rounded-md justify-center gap-3 bg-slate-200 hover:bg-gradient-to-r from-violet-700 to-violet-900 text-slate-600 hover:text-slate-400 font-bold font-sans transition ease-in-out"
        onClick={handleSubmitAll}
        form="bulk-payment-form"
        disabled={pending}
        aria-busy={pending}
      >
        Submit All
      </button>
      }
    </>
  );
};

export default BulkPayment;
