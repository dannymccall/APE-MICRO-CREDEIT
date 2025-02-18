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

    if (state?.response?.success) {
      setShowMessage(true);
      setSelectedRoles([])
      timeout = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
    if(state?.response?.success){
      formRef.current?.reset()
    }

    // Cleanup the timeout when the component unmounts or when state changes
    return () => clearTimeout(timeout);

  }, [state?.response]); // Depend on state.message to run when it changes

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
      <div className="w-full h-full desktop:p-20 laptop:p-15 tablet:p-10 phone:p-5">
        <form
          action={action}
          className="bg-white w-full  border-t-4 border-t-violet-900 py-3 px-7"
          ref={formRef}
        >
          {showMessage && (
            <Toast
              message={state?.response?.message}
              Icon={FaCircleCheck}
              title="User Addition Response"
            />
          )}
          <p className=" text-red-600 p-3 font-bold">
            {!state?.error && state?.response?.message}
          </p>

          <div className="flex flex-row  my-5 relative desktop:flex-row laptop:flex-row tablet:flex-col phone:flex-col">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans text-sm font-semibold text-gray-800"
                labelName="First name:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm desktop:w-96 laptop:w-96 tablet:w-96 phone:w-full px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="firstName"
              placeholder="Enter First name"
            />
          </div>
          {state?.errors?.firstName && (
            <p className=" text-red-500 p-1 text-sm font-semibold">
              {state.errors.firstName}
            </p>
          )}
          <div className="flex desktop:flex-row laptop:flex-row tablet:flex-col phone:flex-col my-5 relative">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans text-sm font-semibold text-gray-800"
                labelName="Last name:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm desktop:w-96 laptop:w-96 tablet:w-96 phone:w-full  px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              name="lastName"
              placeholder="Enter Last name"
            />
          </div>
          {state?.errors?.lastName && (
            <p className=" text-red-500 p-1 text-sm font-semibold">
              {state.errors.lastName}
            </p>
          )}
          <div className="flex desktop:flex-row laptop:flex-row tablet:flex-col phone:flex-col my-5">
            <Label
              className="w-32 font-sans text-sm font-semibold text-gray-800"
              labelName="Other names:"
            />
            <input
              type="text"
              className="block text-sm desktop:w-96 laptop:w-96 tablet:w-96 phone:w-full px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"Other names"}
              name="otherNames"
            />
          </div>
          {state?.errors?.otherNames && (
            <p className=" text-red-500 p-1 text-sm font-semibold">
              {state.errors.otherNames}
            </p>
          )}
          <div className="flex desktop:flex-row laptop:flex-row tablet:flex-col phone:flex-col my-5">
          <div className="flex flex-row w-32 gap-0 items-center">
            <Label
              className="w-32 font-sans text-sm font-semibold text-gray-800"
              labelName="Working Email:"
            />
             <span className="text-red-500 ml-1">*</span>
             </div>
            <input
              type="email"
              className="block text-sm desktop:w-96 laptop:w-96 tablet:w-96 phone:w-full px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"email"}
              name="email"
            />
          </div>
          {state?.errors?.email && (
            <p className="text-red-500 p-1 text-sm font-semibold">
              {state.errors.email}
            </p>
          )}
          <div className="flex desktop:flex-row laptop:flex-row tablet:flex-col phone:flex-col my-5 relative">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-800 text-sm"
                labelName="Date of Birth:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="date"
              className="block text-sm desktop:w-96 laptop:w-96 tablet:w-96 phone:w-full px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="dob"
            />
          </div>
          <input type="hidden" name="service" value="add"/>
          {state?.errors?.dob && (
            <p className=" text-red-500 p-1 text-sm font-semibold">
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
          <div className="flex flex-row flex-wrap  my-2 relative">
            <div className="flex flex-row desktop:w-32 laptop:w-32 tablet:w-32 phone:w-16 items-center my-5">
              <Label
                className="font-sans font-semibold text-gray-800 text-sm"
                labelName="Sex:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <div className="flex flex-row mr-10 items-center">
              <Label
                className="w-16 font-sans font-semibold text-gray-800"
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
                className="w-16 font-sans font-semibold text-gray-800 text-sm"
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
                className="w-16 font-sans font-semibold text-gray-800 text-sm"
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
            <p className=" text-red-500 p-1 text-sm font-semibold">
              {state.errors.sex}
            </p>
          )}
          <div className="flex flex-row  items-center my-5 relative">
            <div className="flex flex-row w-32 items-center my-5">
              <Label
                className=" font-sans font-semibold text-gray-800 text-sm"
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
                    } btn btn-sm flex flex-row justify-between  border-2 border-violet-600 px-2 py-1 rounded-md font-medium hover:bg-violet-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-opacity-50`}
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
            <p className=" text-red-500 p-1 text-sm font-semibold">
              {state.errors.roles}
            </p>
          )}
          <button
            className={`btn desktop:w-24 laptop:w-24 tablet:w-24 phone:w-full flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
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
