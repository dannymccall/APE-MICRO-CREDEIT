"use client";

import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaEye, FaPlus, FaMinus, FaHistory } from "react-icons/fa";
import Modal from "@/app/component/Modal";
import {
  formatCurrency,
  formatDate,
  makeRequest,
} from "@/app/lib/helperFunctions";
import Toast from "@/app/component/toast/Toast";
import { MdOutlineCancel } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import AllTransactions from "../Vaulttransaction/Transactions";
import { LoadingDivs } from "@/app/component/Loaders/Loading";
import { VaultDetails } from "@/app/component/Vault/VaultDetails";
import { TransactionForm } from "@/app/component/Vault/TransactionForm";
import { VaultHeader } from "@/app/component/Vault/VaultHeader";
import { ActionButtons } from "@/app/component/Vault/VaultActionButtons";
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
      purpose: string;
      staff: {
        first_name: string;
        other_names: string;
        last_name: string;
      };
      createdAt: string;
    };
  }>;
}
const VaultDashboard = () => {
  const [depositModal, setDepositModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [vault, setVault] = useState<IVault>();
  const [transactionModal, setTransactionModal] = useState<boolean>(false);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type?: string;
    showNoditifcation?: boolean;
  }>({ message: "", showNoditifcation: false });

  const handleClick = async (type: string, amount: number, purpose: string) => {
    console.log(type);
    setLoading(true);
    const response = await makeRequest("/api/vault", {
      method: "POST",
      body: JSON.stringify({ type, amount, purpose }),
      headers: { "Content-Type": "application/json" },
    });
    // console.log(response);

    if (!response.success) {
      setNotification({
        message: response.message,
        type: "error",
        showNoditifcation: true,
      });
      setLoading(false);
      const timeOut: NodeJS.Timeout = setTimeout(() => {
        setNotification({ showNoditifcation: false, message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timeOut);
    }

    setLoading(false);
    setDepositModal(false);

    setNotification({
      showNoditifcation: true,
      message: response.message,
      type: "success",
    });
    const timeOut: NodeJS.Timeout = setTimeout(() => {
      setNotification({ showNoditifcation: false, message: "", type: "" });
    }, 3000);

    return () => clearTimeout(timeOut);
  };

  useEffect(() => {
    (async () => {
      const response = await makeRequest("/api/vault", {
        method: "GET",
      });

      // console.log(response.transactions);
      setVault(response);
      // console.log(vault?.transactions);
    })();
  }, []);

  const handleDeposit = () => {
    setModalType("deposit");
    setDepositModal(true);
  };

  const handleWithdraw = () => {
    setModalType("withdraw");
    setDepositModal(true);
  };

  return (
    <div className="p-2 desktop:p-6 laptop:p-4 tablet:p-3 phone:p-2 space-y-4 w-full min-h-screen flex flex-col items-center">
      {notification.showNoditifcation && (
        <Toast
          message={notification.message}
          className={
            notification.type === "error" ? "bg-red-600 -z-50" : "bg-violet-600"
          }
          Icon={notification.type === "error" ? MdOutlineCancel : FaCircleCheck}
          title=""
        />
      )}
      {vault ? (
        <React.Fragment>
          <h1 className="text-xl desktop:text-2xl laptop:text-xl tablet:text-lg phone:text-base font-semibold">
            Vault Dashboard
          </h1>

          <div className="card bg-violet-100 p-3 desktop:p-6 laptop:p-5 tablet:p-4 phone:p-3 rounded-xl w-full max-w-4xl">
            <div className="card-body space-y-3 desktop:space-y-4 w-full">
              <VaultHeader
                balance={vault.balance}
                updatedAt={vault.updatedAt}
                transactionCount={vault.transactions.length}
              />
              <ActionButtons
                onView={() => setViewModal(true)}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                onHistory={() => setTransactionModal(true)}
              />
            </div>
          </div>

          {/* Modals */}
          <Modal
            modalOpen={viewModal}
            setModalOpen={setViewModal}
            width="desktop:max-w-4xl laptop:max-w-3xl tablet:max-w-2xl phone:max-w-sm p-2"
          >
            <div className="w-full bg-white p-4 desktop:p-6 rounded-lg border border-violet-400">
              <h2 className="text-base desktop:text-lg font-bold text-gray-800 border-b pb-3">
                Vault Details
              </h2>
              <VaultDetails vault={vault} />
            </div>
          </Modal>

          {/* Transaction Form Modal */}
          <Modal
            modalOpen={depositModal}
            setModalOpen={setDepositModal}
            width="desktop:max-w-md laptop:max-w-sm tablet:max-w-sm phone:w-11/12"
          >
            <TransactionForm
              type={modalType}
              handleClick={handleClick}
              loading={loading}
            />
          </Modal>

          {/* Transaction History Modal */}
          <Modal
            modalOpen={transactionModal}
            setModalOpen={setTransactionModal}
            width="desktop:max-w-4xl laptop:max-w-3xl tablet:max-w-2xl phone:max-w-sm"
          >
            <div className="p-2 desktop:p-4">
              <h1 className="font-sans font-semibold text-gray-600 text-base desktop:text-lg mb-4">
                Transaction History
              </h1>
              <AllTransactions transactions={vault?.transactions ?? []} />
            </div>
          </Modal>
        </React.Fragment>
      ) : (
        <LoadingDivs />
      )}
    </div>
  );
};

export default VaultDashboard;
