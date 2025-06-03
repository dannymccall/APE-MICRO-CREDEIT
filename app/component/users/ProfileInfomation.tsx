import { useState, useActionState, useEffect } from "react";
import { IUser } from "@/app/lib/backend/models/user.model";
import { formatDate, toCapitalized } from "@/app/lib/helperFunctions";
import { FiEdit } from "react-icons/fi";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import { changePassword } from "@/app/actions/changePasswordAuth";
import { LoadingSpinner } from "../../api/Loaders/Loading";
import Modal from "../Modal";
import ViewUser from "@/app/ui/users/View";

export default function ContactInformation({ user }: { user: any }) {
  console.log(user)
  return (
    <main className="bg-white w-96 h-96 flex flex-col p-4 rounded-md gap-5">
      {user && (
        <>
          <div className="flex flex-row justify-between">
            <h1 className="font-bold text-gray-600 font-sans">Details</h1>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-700 font-semibold">Username</h1>
              <span className="text-sm text-violet-600 font-semibold">
                {user.username}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-700 font-semibold">Email</h1>
              <span className="text-sm text-violet-600 font-semibold">
                {user.email}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-700 font-semibold">Sex</h1>
              <span className="text-sm text-violet-600 font-semibold">
                {toCapitalized(user.sex)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-700 font-semibold">Date of Birth</h1>
              <span className="text-sm text-violet-600 font-semibold">
                {formatDate(user.dob)}
              </span>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export function ChangePasswordTemplate({ username }: { username: string }) {
  const [state, action, pending] = useActionState(changePassword, undefined);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  useEffect(() => {
    if (!state?.response?.success) setShowErrorMessage(true);
    else setShowErrorMessage(false);
  });
  return (
    <main className="bg-white w-96 h-100px flex flex-col p-4 rounded-md gap-5 overflow-y-scroll">
      <section>
        <div>
          <h1 className="text-center font-san font-semibold text-xl">
            Change Password
          </h1>
        </div>
        {state?.response?.success === false && (
          <p className="text-red-500 p-1 font-semibold text-center bg-red-200 m-4 border-2 border-red-600 rounded-md desktop:text-base laptop:text-base tablet:text-sm phone:text-xs">
            {state?.response?.message}
          </p>
        )}
        {state?.response?.success === true && (
          <p className="text-green-500 p-1 font-semibold text-center bg-green-200 m-4 border-2 border-green-600 rounded-md desktop:text-base laptop:text-base tablet:text-sm phone:text-xs">
            Success! {state?.response?.message}
          </p>
        )}
        <div>
          <form action={action}>
            <div className="flex flex-col my-5">
              <div className="flex flex-row w-full gap-0 items-center">
                <span className="text-red-500 ml-1">*</span>
                <Label
                  className="font-sans font-semibold text-gray-500 desktop:text-base laptop:text-base tablet:text-sm phone:text-xs"
                  labelName="Current Password"
                />
              </div>
              <input
                type="password"
                className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm desktop:text-base laptop:text-base tablet:text-sm phone:text-xs"
                name="current_password"
              />
            </div>
            {state?.errors?.current_password && (
              <p className=" text-red-500 p-1 font-semibold desktop:text-base laptop:text-base tablet:text-sm phone:text-xs">
                {state.errors.current_password}
              </p>
            )}
            <div className="flex flex-col my-5">
              <div className="flex flex-row w-full gap-0 items-center">
                <span className="text-red-500 ml-1">*</span>
                <Label
                  className="font-sans font-semibold text-gray-500 desktop:text-base laptop:text-base tablet:text-sm phone:text-xs"
                  labelName="Password"
                />
              </div>
              <input
                type="password"
                className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm desktop:text-base laptop:text-base tablet:text-sm phone:text-sx"
                name="password"
              />
            </div>
            {state?.errors?.password && (
              <p className=" text-red-500 p-1 font-semibold desktop:text-base laptop:text-base tablet:text-sm phone:text-xs">
                {state.errors.password}
              </p>
            )}
            <div className="flex flex-col my-5">
              <div className="flex flex-row w-full gap-0 items-center">
                <span className="text-red-500 ml-1">*</span>
                <Label
                  className="font-sans font-semibold text-gray-500 desktop:text-base laptop:text-base tablet:text-sm phone:text-xs"
                  labelName="Confirm Password"
                />
              </div>
              <input
                type="password"
                className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 desktop:text-base laptop:text-base tablet:text-sm phone:text-xs"
                name="confirm_password"
              />
            </div>
            {state?.errors?.confirm_password && (
              <p className=" text-red-500 p-1 font-semibold desktop:text-base laptop:text-base tablet:text-sm phone:text-xs">
                {state.errors.confirm_password}
              </p>
            )}

            <input type="hidden" name="username" value={username} />
            <button
              className={`btn w-full flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
            >
              {pending && <LoadingSpinner />}
              Update Password
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
