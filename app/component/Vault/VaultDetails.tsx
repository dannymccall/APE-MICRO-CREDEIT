import { formatCurrency, formatDate } from "@/app/lib/helperFunctions";

interface IVault {
  _id: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  transactions: Array<{
    transaction: {
      _id: string;
      type: string;
      amount: number;
      staff: {
        first_name: string;
        other_names: string;
        last_name: string;
      };
      createdAt: string;
    };
  }>;
}
export const VaultDetails = ({ vault }: { vault: IVault }) => {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2 desktop:gap-4 laptop:gap-3 pt-4">
      <div className="flex flex-col phone:flex-row tablet:flex-col items-start gap-1">
        <p className="text-gray-600 text-xs desktop:text-sm laptop:text-sm font-medium">
          Vault Name:
        </p>
        <p className="text-gray-900 text-sm desktop:text-base laptop:text-base font-semibold">
          Main Vault
        </p>
      </div>

      <div className="flex flex-col phone:flex-row tablet:flex-col items-start gap-1">
        <p className="text-gray-600 text-xs desktop:text-sm laptop:text-sm font-medium">
          Balance:
        </p>
        <p className="text-gray-900 text-sm desktop:text-base laptop:text-base font-semibold">
          {formatCurrency(vault.balance)}
        </p>
      </div>

      <div className="flex flex-col phone:flex-row tablet:flex-col items-start gap-1">
        <p className="text-gray-600 text-xs desktop:text-sm laptop:text-sm font-medium">
          Transactions:
        </p>
        <p className="text-gray-900 text-sm desktop:text-base laptop:text-base font-semibold">
          {vault.transactions.length}
        </p>
      </div>

      <div className="flex flex-col phone:flex-row tablet:flex-col items-start gap-1">
        <p className="text-gray-600 text-xs desktop:text-sm laptop:text-sm font-medium">
          Last Updated:
        </p>
        <p className="text-gray-900 text-sm desktop:text-base laptop:text-base font-semibold">
          {formatDate(vault.updatedAt)}
        </p>
      </div>
    </div>
  );
};
