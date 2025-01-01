"use client";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import React, { useActionState, useEffect, useState, useRef } from "react";
import { MyTextInput, Label } from "@/app/lib/MyFormInput/FormTemplates";
import { addUser, updateUser } from "@/app/actions/addUserAuth";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { LoadingSpinner } from "@/app/component/Loading";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { IUser } from "@/app/lib/backend/models/user.model";
import { formatDate } from "@/app/lib/utils";

export interface IViewUser {
  user: IUser;
  editForm: boolean;
  setEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  editUser: (user: IUser, id: string) => void;
  setOpenModalEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewUser: React.FC<IViewUser> = ({
  user,
  editForm,
  setEditForm,
  editUser,
  setOpenModalEdit,
}) => {
  const availableRoles = ["Loan officer", "Admin"];
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles); // State to hold selected roles
  const roles: string[] = selectedRoles;
  const [state, action, pending] = useActionState(updateUser, undefined);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
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

    // if (state?.error === undefined) {
    //   let updatedUser: Record<string, string | any> = {}
    //   editUser(user, String(user._id));
    //   if(formRef.current){
    //     const form = formRef.current!;
    //     const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)?.value;
    //     const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)?.value;
    //     const otherNames = (form.elements.namedItem("otherNames") as HTMLInputElement)?.value;
    //     const dob = (form.elements.namedItem("dob") as HTMLInputElement)?.value;
    //     const sex = (form.elements.namedItem("sex") as HTMLInputElement)?.value;
    //     console.log({firstName})
    //     updatedUser = {
    //       firstName,
    //       lastName,
    //       otherNames,
    //       dob,
    //       sex
    //     }
    //   }
    //   console.log(updatedUser)
    // }

    // console.log("error: ", state?.error);

    // console.log({ editForm });
    // Cleanup the timeout when the component unmounts or when state changes
    return () => clearTimeout(timeout);
  }, [state?.message]); // Depend on state.message to run when it changes

  const handleClick = () => {
    if (formRef.current) {
      const form = formRef.current;
      const firstName =
        (form.elements.namedItem("firstName") as HTMLInputElement)?.value || "";
      const lastName =
        (form.elements.namedItem("lastName") as HTMLInputElement)?.value || "";
      const otherNames =
        (form.elements.namedItem("otherNames") as HTMLInputElement)?.value ||
        "";
      const dob =
        (form.elements.namedItem("dob") as HTMLInputElement)?.value || "";
      const sex =
        (form.elements.namedItem("sex") as HTMLInputElement)?.value || "";
      const roles =
        (form.elements.namedItem("roles") as HTMLInputElement)?.value || "";

      const updatedUser: any = {
        first_name: firstName,
        last_name: lastName,
        other_names: otherNames,
        dob,
        sex,
        roles: roles.split(","),
      };
      editUser(updatedUser, String(user._id));
      form.reset();
      setOpenModalEdit(false);
      console.log("Updated User:", updatedUser);
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
          {!editForm ? "View user" : "Update User"}
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
              defaultValue={user.first_name}
              disabled={!editForm}
            />
          </div>
          {state?.errors?.firstName && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.firstName}
            </p>
          )}
          <input type="hidden" name="id" value={String(user._id)} />
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
              defaultValue={user.last_name}
              disabled={!editForm}
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
              defaultValue={user.other_names}
              disabled={!editForm}
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
              type={!editForm ? "text" : "date"}
              className="block w-96 px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="dob"
              defaultValue={!editForm ? formatDate(user.dob) : ""}
              disabled={!editForm}
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
            {!editForm && (
              <input
                type="text"
                className="block w-96 px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue={
                  user.sex.charAt(0).toUpperCase() +
                  user.sex.slice(1).toLowerCase()
                }
                disabled={!editForm}
              />
            )}
            {editForm && (
              <>
                {["Male", "Female", "Others"].map((role, index) => (
                  <div className="flex flex-row items-center mr-10" key={role}>
                    <Label
                      className="w-12 font-sans font-semibold text-gray-800"
                      labelName={role}
                    />
                    <input
                      type="radio"
                      name="sex"
                      className="radio radio-primary text-sm w-4 h-4"
                      value={role}
                      defaultChecked={index === 0} // Check the first radio button by default
                    />
                  </div>
                ))}
              </>
            )}
          </div>
          {state?.errors?.sex && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.sex}
            </p>
          )}

          <div className="flex flex-row  items-center  relative">
            <div className="flex flex-row w-32 items-center my-5">
              <Label
                className=" font-sans font-semibold text-gray-800"
                labelName="Role (s):"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            {!editForm && (
              <ol className="list-item list-disc">
                {user.roles.map((role) => (
                  <li key={role} className="font-sans font-semibold">
                    {role}
                  </li>
                ))}
              </ol>
            )}
            {editForm && (
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
                {user.roles.length > 0 && (
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
            )}
          </div>
          <input type="hidden" name="roles" value={selectedRoles} />
          {state?.errors?.roles && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.roles}
            </p>
          )}
          {editForm && (
            <button
              className={`btn w-24 flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
              onClick={handleClick}
            >
              {pending && <LoadingSpinner />}
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ViewUser;
