"use client";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import React, { useActionState, useEffect, useState, useRef } from "react";
import { MyTextInput, Label } from "@/app/lib/MyFormInput/FormTemplates";
import { addUser } from "@/app/actions/addUserAuth";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { LoadingSpinner } from "@/app/component/Loading";
import QuickAccess from "@/app/component/QuickAccess";
import { useRouter } from "next/navigation";

export interface IAddUser {
  route: string;
}

const AddUser: React.FC<IAddUser> = ({ route }) => {
  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "add-staff",
      href: "/addUser",
    },
  ];

  const formRef = useRef<HTMLFormElement>(null)
  const availableRoles = ["Loan officer", "Admin"];
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]); // State to hold selected roles
  const roles: string[] = selectedRoles;
  const [state, action, pending] = useActionState(addUser, undefined);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const router = useRouter();
  // const {pending} = useFormStatus()
  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role)); // Remove role if already selected
    } else {
      setSelectedRoles([...selectedRoles, role]); // Add role if not already selected
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (state?.message) {
      setShowMessage(true);
      timeout = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
    if(state?.message === "success"){
      formRef.current?.reset()
    }

    // Cleanup the timeout when the component unmounts or when state changes
    return () => clearTimeout(timeout);

  }, [state?.message]); // Depend on state.message to run when it changes

  const onClick = () => {
    router.push("/manage-user");
  };
  return (
    <div className="w-full h-full">
      <InfoHeaderComponent
        route={route}
        links={breadcrumbsLinks}
        title="Manage staff"
        onClick={onClick}
      />
      <div className="w-full h-full p-20">
        <form
          action={action}
          className="bg-white shadow-md w-full  border-t-4 border-t-violet-900 py-3 px-7"
          ref={formRef}
        >
          {showMessage && (
            <Toast
              message={state?.message}
              Icon={FaCircleCheck}
              title="User Addition Response"
            />
          )}
          <p className=" text-red-600 p-3 font-bold">
            {!state?.error && state?.message}
          </p>

          <div className="flex flex-row items-center my-5 relative">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-800"
                labelName="First name:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block w-96 px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="firstName"
              placeholder="Enter First name"
            />
          </div>
          {state?.errors?.firstName && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.firstName}
            </p>
          )}
          <div className="flex flex-row items-center my-5 relative">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-800"
                labelName="Last name:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block w-96 px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="lastName"
              placeholder="Enter Last name"
            />
          </div>
          {state?.errors?.lastName && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.lastName}
            </p>
          )}
          <div className="flex flex-row items-center my-5">
            <Label
              className="w-32 font-sans font-semibold text-gray-800"
              labelName="Other names:"
            />
            <input
              type="text"
              className="block w-96 px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"Other names"}
              name="otherNames"
            />
          </div>
          {state?.errors?.otherNames && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.otherNames}
            </p>
          )}
          <div className="flex flex-row items-center my-5 relative">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-800"
                labelName="Date of Birth:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="date"
              className="block w-96 px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="dob"
            />
          </div>
          {state?.errors?.dob && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.dob}
            </p>
          )}
          {/* {state?.errors?.dob && (
            <div>
              <p>Date of birth must:</p>
              <ul>
                {state.errors.dob.map((error) => (
                  <li key={error} className="text-red-500 font-semibold">
                    - {error}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
          <div className="flex flex-row  items-center my-2 relative">
            <div className="flex flex-row w-32 items-center my-5">
              <Label
                className="font-sans font-semibold text-gray-800"
                labelName="Sex:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <div className="flex flex-row items-center mr-10">
              <Label
                className="w-12 font-sans font-semibold text-gray-800"
                labelName="Male"
              />
              <input
                type="radio"
                name="sex"
                className="radio radio-primary text-sm w-4 h-4"
                defaultChecked
                value="Male"
              />
            </div>
            <div className="flex flex-row items-center mr-10">
              <Label
                className="w-16 font-sans font-semibold text-gray-800"
                labelName="Female"
              />
              <input
                type="radio"
                name="sex"
                className="radio radio-primary w-4 h-4"
                value="Female"
              />
            </div>
            <div className="flex flex-row items-center">
              <Label
                className="w-16 font-sans font-semibold text-gray-800"
                labelName="Others"
              />
              <input
                type="radio"
                name="sex"
                className="radio radio-primary w-4 h-4"
                value="others"
              />
            </div>
          </div>
          {state?.errors?.sex && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.sex}
            </p>
          )}
          <div className="flex flex-row  items-center my-5 relative">
            <div className="flex flex-row w-32 items-center my-5">
              <Label
                className=" font-sans font-semibold text-gray-800"
                labelName="Role (s):"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <div className="flex flex-col  mr-10">
              <div className="flex flex-row gap-5">
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`${
                      selectedRoles.includes(role)
                        ? "bg-violet-600 text-white"
                        : "bg-white text-violet-600"
                    } flex flex-row justify-between  border-2 border-violet-600 px-2 py-1 rounded-md font-medium hover:bg-violet-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-opacity-50`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {selectedRoles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-2 p-2">
                  {selectedRoles.map((role, index) => (
                    <div
                      key={index}
                      className="bg-violet-600 text-white px-3 py-1 rounded-md  flex items-center gap-2"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedRoles(
                            selectedRoles.filter((r) => r !== role)
                          )
                        }
                        className="text-sm text-white  hover:text-violet-300"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <input type="hidden" name="roles" value={selectedRoles} />
          {state?.errors?.roles && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.roles}
            </p>
          )}
          <button
            className={`btn w-24 flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
          >
            {pending && <LoadingSpinner />}
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
