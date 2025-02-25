import { formatCurrency, formatDate } from "@/app/lib/helperFunctions";
import { FaShieldAlt } from "react-icons/fa";

interface VaultHeaderProps {
  balance: number;
  updatedAt: string;
  transactionCount: number;
}

export const VaultHeader = ({
  balance,
  updatedAt,
  transactionCount,
}: VaultHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h2 className="text-base desktop:text-lg laptop:text-base tablet:text-sm phone:text-sm font-medium">
          Main Vault
        </h2>
        <FaShieldAlt className="text-violet-900" size={18} />
      </div>
      <div className="space-y-2 desktop:space-y-3">
        <p className="text-gray-700 font-bold text-sm desktop:text-base">
          Balance: {formatCurrency(balance)}
        </p>
        <p className="text-gray-500 text-xs desktop:text-sm">
          Last updated: {formatDate(updatedAt)}
        </p>
        <p className="text-gray-700 text-sm desktop:text-base">
          Transactions: {transactionCount}
        </p>
      </div>
    </>
  );
};
