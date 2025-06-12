"use client";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import { addBranch } from "@/app/actions/addBranchAuth";
import { FaCircleCheck } from "react-icons/fa6";
import Toast from "@/app/component/toast/Toast";
import { LoadingSpinner } from "@/app/component/Loaders/Loading";

const AddBranch = () => {
  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "add-branch",
      href: "/add-branch",
    },
  ];
  const router = useRouter();
  const [state, action, pending] = useActionState(addBranch, undefined);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const onClick = () => {
    router.push("/manage-branch");
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (state?.message) {
      setShowMessage(true);
      timeout = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
    // if(state?.message === "success"){
    //   formRef.current?.reset()
    // }

    // Cleanup the timeout when the component unmounts or when state changes
    return () => clearTimeout(timeout);
  }, [state?.message]); // Depend on state.message to run when it changes
  return (
    <main>
      {showMessage && (
        <Toast
          message={state?.message}
          Icon={FaCircleCheck}
          title="Branch Addition Response"
        />
      )}
      <InfoHeaderComponent
        route={"ADD BRANCH"}
        links={breadcrumbsLinks}
        title="Manage branch"
        onClick={onClick}
      />
      <div className="w-full h-full desktop:p-20 laptop:p-10 tablet:p-5 phone:p-2">
        <form
          action={action}
          className="bg-white w-full  border-t-4 border-t-violet-900 py-3 px-7"
        >
          <p className=" text-red-600 p-3 font-bold">
            {!state?.errors && state?.message}
          </p>

          <div className="flex flex-row  my-5 relative  desktop:flex-row laptop:flex-row tablet:flex-row phone:flex-col">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-800"
                labelName="Branch name:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm w-full px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="branchName"
              placeholder="Enter Branch name"
            />
          </div>
          {state?.errors?.branchName && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.branchName}
            </p>
          )}

          <button
            className={`btn btn-sm w-24 flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
          >
            {pending && <LoadingSpinner />}
            Save
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddBranch;
