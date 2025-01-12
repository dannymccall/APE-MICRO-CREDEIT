import React, { useState } from "react";
import { IClient } from "@/app/lib/backend/models/client.model";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";

interface ClientDetailsProps {
  clients: IClient[] | any;
}

const BulkPayment: React.FC<ClientDetailsProps> = ({ clients }) => {
  const [formData, setFormData] = useState<Record<number, { amount: string }>>(
    {}
  );
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
      try {
        // await processLoan({ payments: formData });
        console.log("All payments submitted:", formData);
      } catch (error) {
        console.error("Error submitting payments:", error);
      }
    };
  
  return (
    <>
      <div className="w-full flex gap-10">
        {clients.map((client: IClient, index: number) => (
          <div
            className="max-w-80 gap-5 flex flex-col bg-[url('../public/checkout.jpg')] bg-cover bg-center rounded-md"
            key={index}
          >
            <div className="h-full gap-5 flex flex-col justify-evenly mt-5 w-72">
              <div className="w-full flex gap-1 flex-col ml-5">
                <p className="text-Base font-mono text-slate-50">NAME</p>
                <span className="w-full text-xl font-mono text-slate-50">
                  {client.first_name} {client.last_name}
                </span>
              </div>
              <div className="w-full flex gap-1 flex-col ml-5">
                <p className="text-Base font-mono text-slate-50">TOTAL</p>
                <span className="w-full text-3xl font-mono text-slate-50">
                  GHS {Number(client.loans[0]?.weeklyAmount).toFixed(2)}
                </span>
              </div>
              <div className="w-full flex gap-1 flex-col ml-5">
                <p className="text-Base font-mono text-slate-50">DATE</p>
                <span className="w-full text-xl font-mono text-white">
                  {new Date(client.nextPayment).toDateString()}
                </span>
              </div>
            </div>
            <form
              className="w-full h-full flex items-center ml-5"
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
              </div>
            </form>
          </div>
        ))}
        {/* A global button to process all forms */}
      </div>
      <button
        className="btn w-28 h-10 mt-5 flex items-center rounded-md justify-center gap-3 bg-slate-200 hover:bg-gradient-to-r from-violet-700 to-violet-900 text-slate-600 hover:text-slate-400 font-bold font-sans transition ease-in-out"
        onClick={handleSubmitAll}
      >
        Submit All
      </button>
    </>
  );
};

export default BulkPayment;
