"use client";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import React, { useActionState, useEffect, useState, useRef } from "react";
import { MyTextInput, Label } from "@/app/lib/MyFormInput/FormTemplates";
import {  updateBranch } from "@/app/actions/addBranchAuth";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { LoadingSpinner } from "@/app/component/Loaders/Loading";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { IBranch } from "@/app/lib/backend/models/branch.model";
import { formatDate } from "@/app/lib/helperFunctions";

export interface IViewUser {
  branch: IBranch;
  editForm: boolean;
  setEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  editBranch: (branch: IBranch, id: string) => void;
  setOpenModalEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewBranch: React.FC<IViewUser> = ({
  branch,
  editForm,
  setEditForm,
  editBranch,
  setOpenModalEdit,
}) => {
  const [state, action, pending] = useActionState(updateBranch, undefined);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  // const {pending} = useFormStatus()

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (state?.message) {
      setShowMessage(true);
      timeout = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [state?.message]); // Depend on state.message to run when it changes

  const handleClick = () => {
    if (formRef.current) {
      const form = formRef.current;
      const branchName =
        (form.elements.namedItem("branchName") as HTMLInputElement)?.value || "";

      const updatedBranch: any = {
        branchName: branchName,
      };
      editBranch(updatedBranch, String(branch._id));
      form.reset();
      setOpenModalEdit(false);
    }
  };

  return (
    <div className="w-full h-full">
      {/* {showMessage && (
        <Toast
          message={state?.message}
          Icon={FaCircleCheck}
          title="User Addition Response"
        />
      )} */}
      <div className="w-full flex justify-between items-center px-4 border-b-2 align-middle">
        <h1 className="font-sans font-semibold text-lg">
          {!editForm ? "View branch" : "Update branch"}
        </h1>
        <div className="flex">
          <button
            className="flex gap-2 mx-5 items-center text-violet-700 hover:text-violet-900  font-semibold"
            onClick={() => setEditForm(true)}
          >
            <FiEdit className="font-semibold" />
            Edit
          </button>
        </div>
      </div>

      <div className="w-full h-full ">
        <form
          action={action}
          ref={formRef}
          className="bg-white w-full py-3 px-7"
        >
          <p className=" text-red-600 p-3 font-bold">
            {!state?.error && state?.message}
          </p>

          <div className="flex desktop:flex-row laptop:flex-row tablet:flex-row phone:flex-col  my-5 relative">
            <div className="flex flex-row w-40 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-800"
                labelName="Branch name:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block w-full px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="branchName"
              placeholder="Enter branch name"
              defaultValue={branch.branchName}
              disabled={!editForm}
            />
          </div>
          {state?.errors?.branchName && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.branchName}
            </p>
          )}
          <input type="hidden" name="id" value={String(branch._id)} />

          {editForm && (
            <button
              className={`btn w-24 flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
              onClick={handleClick}
            >
              {pending && <LoadingSpinner />}
              Update
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ViewBranch;
