import React from "react";
import { FaShieldAlt, FaEye, FaPlus, FaMinus, FaHistory } from "react-icons/fa";

const VaultDashboard = () => {
  const vault = {
    name: "Main Vault",
    balance: "$50,000",
    lastUpdated: "2025-02-22",
    transactions: 120,
    encrypted: true,
  };

  return (
    <div className="p-6 space-y-4 w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold">Vault Dashboard</h1>
      <div className="card bg-base-100 shadow-xl p-6 rounded-xl w-full max-w-4xl">
        <div className="card-body space-y-4 w-full">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-medium">{vault.name}</h2>
            {vault.encrypted && <FaShieldAlt className="text-green-500" size={18} />}
          </div>
          <p className="text-gray-700 font-bold">Balance: {vault.balance}</p>
          <p className="text-gray-500 text-sm">Last updated: {vault.lastUpdated}</p>
          <p className="text-gray-700">Transactions: {vault.transactions}</p>
          <div className="flex gap-4 mt-4 w-full">
            <button className="btn btn-outline btn-sm flex-1">
              <FaEye size={16} className="mr-1" /> View
            </button>
            <button className="btn btn-outline btn-sm flex-1">
              <FaPlus size={16} className="mr-1" /> Deposit
            </button>
            <button className="btn btn-outline btn-sm flex-1">
              <FaMinus size={16} className="mr-1" /> Withdraw
            </button>
            <button className="btn btn-outline btn-sm flex-1">
              <FaHistory size={16} className="mr-1" /> History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDashboard;
