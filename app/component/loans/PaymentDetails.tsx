import React from "react";
import { IClient } from "@/app/lib/backend/models/client.model";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";

interface ClientDetailsProps {
  client: IClient | any;
  paymentDate: any
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, paymentDate }) => {
  return (
    <div
    className={`flex flex-row max-w-2xl bg-slate-200 mt-5 rounded shadow-md transition-all duration-300 ease-in-out ${
        client ? "h-96" : "h-0"
      } overflow-hidden`}
    >
      <div className="w-full h-full flex flex-col justify-evenly">
        <div className="w-full flex gap-1 flex-col ml-5">
        <p className="text-Base font-mono">NAME</p>

          <span className="w-full text-xl font-mono">
            {client.first_name} {client.last_name}
          </span>
        </div>
        <div className="w-full flex gap-1 flex-col ml-5">
            <p className="text-Base font-mono">TOTAL</p>
          <span className="w-full text-3xl font-mono">
            GHS {Number(client.loans[0]?.weeklyAmount).toFixed(2)}
          </span>
        </div>
        <div className="w-full flex gap-1 flex-col ml-5">
        <p className="text-Base font-mono">DATE</p>

          <span className="w-full text-xl font-mono">{paymentDate}</span>
        </div>
      </div>
      <div className="w-full flex bg-[url('../public/checkout.jpg')] bg-cover bg-center">
        <form className="w-full h-full flex items-center ml-5">
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
              className="block text-sm w-64 px-5 text-white py-2 border-2 bg-transparent border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-violet-300 focus:border-violet-400 sm:text-sm"
              placeholder="Enter Amount"
              name="amount"
            />
            <button
              className="btn h-4 mt-5 flex items-center rounded-md justify-center gap-3 bg-slate-200  hover:from-violet-700 hover:to-violet-900 text-black  font-bold font-sans transition"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientDetails;
