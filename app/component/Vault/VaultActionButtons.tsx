import { FaHistory } from "react-icons/fa";
import { FaEye, FaMinus, FaPlus } from "react-icons/fa6";

interface ActionButtonsProps {
    onView: () => void;
    onDeposit: () => void;
    onWithdraw: () => void;
    onHistory: () => void;
  }
  
  export const ActionButtons = ({ onView, onDeposit, onWithdraw, onHistory }: ActionButtonsProps) => {
    return (
      <div className="grid grid-cols-2 desktop:flex laptop:flex tablet:grid-cols-2 phone:grid-cols-2 gap-2 desktop:gap-4 mt-4 w-full">
        <button
          className="btn btn-outline btn-sm flex-1 text-xs desktop:text-sm"
          onClick={onView}
        >
          <FaEye size={14} className="mr-1" /> View
        </button>
        <button
          className="btn btn-outline btn-sm flex-1 text-xs desktop:text-sm"
          onClick={onDeposit}
        >
          <FaPlus size={14} className="mr-1" /> Deposit
        </button>
        <button
          className="btn btn-outline btn-sm flex-1 text-xs desktop:text-sm"
          onClick={onWithdraw}
        >
          <FaMinus size={14} className="mr-1" /> Withdraw
        </button>
        <button
          className="btn btn-outline btn-sm flex-1 text-xs desktop:text-sm"
          onClick={onHistory}
        >
          <FaHistory size={14} className="mr-1" /> History
        </button>
      </div>
    );
  };