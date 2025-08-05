"use client";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import React, { useActionState, useEffect, useState, useRef } from "react";
import { MyTextInput, Label } from "@/app/lib/MyFormInput/FormTemplates";
import { addClient } from "@/app/actions/addClientAuth";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { LoadingSpinner } from "@/app/component/Loaders/Loading";
import QuickAccess from "@/app/component/QuickAccess";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/app/lib/helperFunctions";
import Image from "next/image";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  FormField,
  inputClasses,
  InputField,
  SelectField,
  RadioField,
} from "@/app/component/FormElements";

const AddUser = () => {
  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "add-client",
      href: "/add-client",
    },
  ];

  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(addClient, undefined);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const router = useRouter();
  const [branches, setBranches] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [passport, setPassport] = useState<string>("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const [branchesResponse, usersResponse] = await Promise.all([
          makeRequest("/api/branches", { method: "GET", cache: "no-store" }),
          makeRequest("/api/users", { method: "GET", cache: "no-store" }),
        ]);
        setBranches(branchesResponse.data); // Update state with the fetched data
        setUsers(usersResponse.data);
      } catch (error: any) {
        // console.error("Error fetching branches:", error);
        throw new Error(error.message);
      }
    };

    fetchBranches();
  }, []); // Empty dependency array ensures this runs once on mount

  // Monitor changes to `branches`
  // useEffect(() => {
  //   console.log("Updated branches state:", branches);
  //   console.log(users, branches);
  // }, [branches]); // Logs whenever `branches` changes // Empty dependency array ensures this runs once on mount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    // console.log(file);
    if (file) {
      // Create a URL for the file and update the stat
      const fileUrl = URL.createObjectURL(file);
      setPassport(fileUrl);
    }
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
      formRef.current?.reset();
    }
    // Cleanup the timeout when the component unmounts or when state changes
    return () => clearTimeout(timeout);
  }, [state?.message]); // Depend on state.message to run when it changes

  const onClick = () => {
    router.push("/manage-client");
  };

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
    <div className="w-full h-full">
      <InfoHeaderComponent
        route={"ADD CLIENT"}
        links={breadcrumbsLinks}
        title="Manage client"
        onClick={onClick}
      />
      <div className="w-full h-full p-20 phone:p-5 desktop:p-20 laptop:p-20">
        <form
          action={action}
          className="bg-white  w-full  border-t-4 border-t-violet-900 py-3 px-7"
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
            {state?.errors && state?.message}
          </p>

          <FormField label="Title" required>
            <SelectField name="title" defaultValue="" options={title} />
            {state?.errors?.title && (
              <p className=" text-red-500 p-3 font-semibold">
                {state.errors.title}
              </p>
            )}
          </FormField>
          <div className="flex flex-row flex-grow gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
            <FormField label="First Name" required>
              <InputField
                name="firstName"
                placeholder="Enter First Name"
                type="text"
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
              />
              {state?.errors?.nickName && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.nickName}
                </p>
              )}
            </FormField>
          </div>
          <div className="flex flex-row flex-grow gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
            <FormField label="Branch" required>
              <SelectField
                name="branch"
                defaultValue=""
                options={branches.map((branch: any) => branch.branchName)}
              />
              {state?.errors?.branch && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.branch}
                </p>
              )}
            </FormField>

            <FormField label="Union" required>
              <InputField name="union" placeholder="Enter Union" type="text" />
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
              />
              {state?.errors?.unionLocation && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.unionLocation}
                </p>
              )}
            </FormField>
          </div>

          <div className="flex flex-row flex-grow gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
            <FormField label="Mobile" required>
              <InputField
                name="mobile"
                placeholder="Enter Mobile"
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
              />
              {state?.errors?.residence && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.residence}
                </p>
              )}
            </FormField>

            <FormField label="Date of Birth" required>
              <InputField name="dob" placeholder="Enter Mobile" type="date" />
              {state?.errors?.dob && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.dob}
                </p>
              )}
            </FormField>
          </div>
          <div className="flex flex-row flex-grow gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
            <FormField label="ID Type" required>
              <SelectField name="idType" defaultValue="" options={idType} />
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
              />
              {state?.errors?.idNumber && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.idNumber}
                </p>
              )}
            </FormField>
          </div>
          <div className="flex flex-row flex-grow gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
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
                  <Image
                    src={passport}
                    alt="passport"
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </FormField>
            <input type="hidden" name="service" value="addClient" />
            <div className="flex flex-col my-5 w-full">
              <div className="flex flex-row w-32 gap-0 items-center">
                <Label
                  className="font-sans font-semibold text-gray-500"
                  labelName="staff"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <select
                name="staff"
                className="block w-full text-sm font-sans px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                defaultValue=""
              >
                <option disabled value="" className="text-sm font-sans">
                  Select staff
                </option>
                {users.map((user: any) => (
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
          </div>

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
