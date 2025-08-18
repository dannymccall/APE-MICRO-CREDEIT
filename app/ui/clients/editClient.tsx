"use client";
import React, { useActionState, useEffect, useState, useRef } from "react";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import { addClient } from "@/app/actions/addClientAuth";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { LoadingSpinner } from "@/app/component/Loaders/Loading";
import {
  formatDate,
  makeRequest,
  toCapitalized,
} from "@/app/lib/helperFunctions";
import Image from "next/image";
import { IClient } from "@/app/lib/backend/models/client.model";
import { useRouter } from "next/navigation";
import {
  FormField,
  InputField,
  SelectField,
  RadioField,
} from "@/app/component/FormElements";

export interface IEditClient {
  client: IClient | any;
  setOpenModalEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditClient: React.FC<IEditClient> = ({ client, setOpenModalEdit }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(addClient, undefined);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [branches, setBranches] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [passport, setPassport] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const [branchesResponse, usersResponse] = await Promise.all([
          makeRequest("/api/branches", { method: "GET", cache: "no-store" }),
          makeRequest("/api/users", { method: "GET", cache: "no-store" }),
        ]);
        setBranches(branchesResponse.data); // Update state with the fetched data
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []); // Empty dependency array ensures this runs once on mount

  // Monitor changes to `branches`
  // useEffect(() => {
  //   console.log("Updated branches state:", branches);
  //   console.log(users, branches);
  // }, [branches, users]); // Logs whenever `branches` changes // Empty dependency array ensures this runs once on mount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    // console.log(file);
    if (file) {
      // Create a URL for the file and update the stat
      const fileUrl = URL.createObjectURL(file);
      setPassport(fileUrl);
    }
  };

  const onEditClient = () => {
    setOpenModalEdit(false);
    router.refresh();
  };
  // useEffect(() => {
  //   fetchBranches();
  // },[]);
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (state?.message) {
      setShowMessage(true);
      timeout = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
    if (state?.message === "success") {
      router.refresh();
      formRef.current?.reset();
    }
    // Cleanup the timeout when the component unmounts or when state changes
    return () => clearTimeout(timeout);
  }, [state?.message]); // Depend on state.message to run when it changes

  const title = ["Mr", "Mrs", "Dr"];

  const idType = [
    "Ghana card",
    "Voters ID card",
    "Passport",
    "Driver's license",
  ];

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Invoke action with form data and dynamic dropdown values
  //   if (formRef.current) {
  //     const formData = new FormData(formRef.current); // Extract all form values
  //     action(formData, titles); // Pass FormData and titles to the action
  //   }
  // };
  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="w-full h-full tablet:p-5 desktop:14 laptop:p-10 phone:p-3 overflow-x-auto">
        <form
          action={action}
          className="bg-white shadow-sm w-full  border-t-4 border-t-violet-900 "
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
            {!state?.errors && state?.message}
          </p>
          <input type="hidden" name="service" value="updateClient" />
          <FormField label="Title" required>
            <SelectField
              name="title"
              defaultValue=""
              options={[...title, client.title]}
            useLower={false}
            />
            {state?.errors?.title && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.title}
              </p>
            )}
          </FormField>
          <FormField label="First Name" required>
            <InputField
              name="firstName"
              placeholder="Enter First Name"
              type="text"
              defaultValue={client.first_name}
            />
            {state?.errors?.firstName && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.firstName}
              </p>
            )}
          </FormField>
          <FormField label="Last Name" required>
            <InputField
              name="lastName"
              placeholder="Enter Last Name"
              type="text"
              defaultValue={client.last_name}
            />
            {state?.errors?.lastName && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.lastName}
              </p>
            )}
          </FormField>
          <FormField label="Nick Name" required>
            <InputField
              name="nickName"
              placeholder="Enter Nick Name"
              type="text"
              defaultValue={client.nick_name}
            />
            {state?.errors?.nickName && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.nickName}
              </p>
            )}
          </FormField>
          <FormField label="Branch" required>
            <SelectField
              name="branch"
              defaultValue=""
              options={[
                client.branch.branchName,
                ...branches.map((branch: any) => branch.branchName),
              ]}
            />
            {state?.errors?.branch && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.branch}
              </p>
            )}
          </FormField>
          <FormField label="Client Status" required>
            <SelectField
              name="clientStatus"
              defaultValue=""
              useLower={true}
              options={[
                toCapitalized(client.client_status),
                "Active",
                "Dormant",
                "In Active",
              ]}
            />
          </FormField>

          <FormField label="Union" required>
            <InputField
              name="union"
              defaultValue={client.union}
              placeholder="Enter Union"
              type="text"
            />
            {state?.errors?.union && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.union}
              </p>
            )}
          </FormField>
          <FormField label="Union Location" required>
            <InputField
              name="unionLocation"
              placeholder="Enter Union Location"
              type="text"
              defaultValue={client.unionLocation}
            />
            {state?.errors?.unionLocation && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.unionLocation}
              </p>
            )}
          </FormField>
          <FormField label="Mobile" required>
            <InputField
              name="mobile"
              placeholder="Enter Mobile"
              defaultValue={client.mobile}
              type="text"
            />
            {state?.errors?.mobile && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.mobile}
              </p>
            )}
          </FormField>
          <FormField label="Residence" required>
            <InputField
              name="residence"
              placeholder="Enter Residence"
              type="text"
              defaultValue={client.residence}
            />
            {state?.errors?.residence && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.residence}
              </p>
            )}
          </FormField>
          <FormField label="Date of Birth" required>
            <InputField
              name="dob"
              placeholder="Enter Mobile"
              defaultValue={formatDate(client.dob)}
              type="date"
            />
            {state?.errors?.dob && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.dob}
              </p>
            )}
          </FormField>
          <FormField label="ID Type" required>
            <SelectField
              name="idType"
              defaultValue=""
              options={[client.idType, ...idType]}
            />
            {state?.errors?.idType && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.idType}
              </p>
            )}
          </FormField>

          <FormField label="ID Number" required>
            <InputField
              name="idNumber"
              placeholder="Enter ID Number"
              type="text"
              defaultValue={client.idNumber}
            />
            {state?.errors?.idNumber && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.idNumber}
              </p>
            )}
          </FormField>
          <FormField label="Photo" required>
            <InputField
              name="passport"
              placeholder="Enter Mobile"
              type="file"
              onChange={handleFileChange}
            />
            {state?.errors?.passport && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.passport}
              </p>
            )}
            {passport && !state?.errors?.passport && !state?.errors && (
              <div className="mt-5">
                <Image src={passport} alt="passport" width={200} height={200} />
              </div>
            )}
          </FormField>
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Staff"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <select
              name="staff"
              className="block w-full text-sm font-sans px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer tablet:w-96 desktop:w-full laptop:w-full phone:w-64"
              defaultValue=""
            >
              <option
                value={client.staff.username}
                className="text-sm font-sans"
              >
                {client.staff.first_name} {client.staff.other_names}{" "}
                {client.staff.last_name}
              </option>
              {users.length > 0 &&
                users.map((user: any) => (
                  <option
                    value={user.username}
                    key={user.username}
                    className="text-sm font-sans"
                  >
                    {user.first_name} {user.other_names} {user.last_name}
                  </option>
                ))}
            </select>
          </div>
          {state?.errors?.staff && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.staff}
            </p>
          )}
          <input type="hidden" name="id" value={client._id} />
          <div className="space-y-2 my-5">
            <RadioField
              options={["Single", "Married", "Divorced", "Widowed"]}
              name="maritalStatus"
              label="Marital Status"
              required
            >
              {state?.errors?.sex && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.sex}
                </p>
              )}
            </RadioField>
          </div>

          <div className="space-y-2 my-5">
            <RadioField
              options={["Male", "Female"]}
              name="gender"
              label="Gender"
              required
            >
              {state?.errors?.gender && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.gender}
                </p>
              )}
            </RadioField>
          </div>

          <button
            className={`btn w-24 flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
            onClick={() => onEditClient()}
          >
            {pending && <LoadingSpinner />}
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditClient;
