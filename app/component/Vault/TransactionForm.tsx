import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

export const TransactionForm = ({
  type,
  handleClick,
  loading,
}: {
  type: string;
  handleClick: (type: string, amount: number) => Promise<any>;
  loading: boolean;
}) => {
  const [amount, setAmount] = useState<number>();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-sans font-semibold text-gray-600">
        {type === "deposit" ? "Make Deposit" : "Make Withdrawal"}
      </h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder={`Enter Amount to ${
          type === "deposit" ? "Deposit" : "Withdraw"
        }`}
        className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
      />
      <button
        type="button"
        className="btn btn-sm glass bg-gradient-to-tr from-violet-200 to-violet-300 hover:from-violet-700 hover:to-violet-900 hover:text-slate-100 transition-all duration-75"
        disabled={isNaN(amount ?? 0) || (amount ?? 0) <= 0}
        onClick={() => handleClick(type, amount ?? 0)}
      >
        {type === "deposit" ? (
          loading ? (
            <span className="loading loading-ring loading-xs"></span>
          ) : (
            <>
              <FaPlus size={16} className="mr-1" />
              Deposit
            </>
          )
        ) : loading ? (
          <span className="loading loading-ring loading-xs"></span>
        ) : (
          <>
            <FaMinus size={16} className="mr-1" />
            Withdraw
          </>
        )}
      </button>
    </div>
  );
};
