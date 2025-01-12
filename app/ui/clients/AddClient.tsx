"use client";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import React, { useActionState, useEffect, useState, useRef } from "react";
import { MyTextInput, Label } from "@/app/lib/MyFormInput/FormTemplates";
import { addClient } from "@/app/actions/addClientAuth";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { LoadingSpinner } from "@/app/component/Loading";
import QuickAccess from "@/app/component/QuickAccess";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/app/lib/utils";
import Image from "next/image";

export interface IAddUser {
  route: string;
}

const AddUser: React.FC<IAddUser> = ({ route }) => {
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
  // }, [branches]); // Logs whenever `branches` changes // Empty dependency array ensures this runs once on mount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    console.log(file);
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

  const title = [
    { name: "Mr", value: "Mr" },
    { name: "Mrs", value: "Mrs" },
    { name: "Dr", value: "Dr" },
  ];

  const idType = [
    { name: "Ghana card", value: "gh-card" },
    { name: "Voters ID card", value: "voter-id-card" },
    { name: "Passport", value: "passport" },
    { name: "Driver's license", value: "driver-license" },
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
            {!state?.errors && state?.message}
          </p>

          <div className="flex flex-col  my-5 relative">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="First name"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block  text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="firstName"
              placeholder="Enter First name"
            />
          </div>
          {state?.errors?.firstName && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.firstName}
            </p>
          )}
          <div className="flex flex-col my-5 relative">
            <div className="flex flex-row w-full gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Last name"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="lastName"
              placeholder="Enter Last name"
            />
          </div>
          {state?.errors?.lastName && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.lastName}
            </p>
          )}
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Nick name"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"Enter nick name"}
              name="nickName"
            />
          </div>
          {state?.errors?.nickName && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.nickName}
            </p>
          )}
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Title"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>

            <select
              name="title"
              defaultValue=""
              className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            >
              <option disabled value="">
                Select title
              </option>
              {title && title.length > 0 ? (
                title.map((titleValue) => (
                  <option
                    value={titleValue.value}
                    key={titleValue.value}
                    className="text-sm font-sans"
                  >
                    {titleValue.name}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  No titles available
                </option>
              )}
            </select>
          </div>
          {state?.errors?.title && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.title}
            </p>
          )}
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Branch"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <select
              name="branch"
              className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              defaultValue=""
            >
              <option disabled value="" selected>
                Select branch
              </option>
              {branches.map((branch: any) => (
                <option
                  value={branch.branchName}
                  key={branch.branchName}
                  className="text-sm font-sans"
                >
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
          {state?.errors?.branch && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.branch}
            </p>
          )}
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Union"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"Enter union"}
              name="union"
            />
          </div>
          {state?.errors?.union && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.union}
            </p>
          )}
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-36 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Location of union"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm font-sans  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"Enter union location"}
              name="unionLocation"
            />
          </div>
          {state?.errors?.unionLocation && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.unionLocation}
            </p>
          )}
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Mibile"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"Enter mobile"}
              name="mobile"
            />
          </div>
          {state?.errors?.mobile && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.mobile}
            </p>
          )}
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Residence"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"Enter residence"}
              name="residence"
            />
          </div>
          {state?.errors?.residence && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.residence}
            </p>
          )}
          <div className="flex flex-col my-5 relative">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Date of Birth:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="date"
              className="block w-full text-sm font-sans px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="dob"
            />
          </div>
          {state?.errors?.dob && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.dob}
            </p>
          )}
          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="ID type"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <select
              name="idType"
              className="block text-sm font-sans  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              defaultValue=""
            >
              <option disabled value="" selected className="text-sm font-sans">
                Select ID Type
              </option>
              {idType.map((id: any) => (
                <option
                  value={id.name}
                  key={id.name}
                  className="text-sm font-sans"
                >
                  {id.name}
                </option>
              ))}
            </select>
          </div>
          {state?.errors?.idType && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.idType}
            </p>
          )}

          <div className="flex flex-col my-5">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="ID Number"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={"Enter ID Number"}
              name="idNumber"
            />
          </div>
          {state?.errors?.idNumber && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.idNumber}
            </p>
          )}
          <div className="flex flex-row my-5 w-full gap-8">
            <div className="w-full">
              <div className="flex flex-row w-32 gap-0 items-center">
                <Label
                  className="font-sans font-semibold text-gray-500"
                  labelName="Passport"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <input
                type="file"
                className="file-input text-sm font-sans block w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                name="passport"
                onChange={handleFileChange}
              />
            </div>
            {passport && !state?.errors?.passport && !state?.errors && (
              <div>
                <Image src={passport} alt="passport" width={200} height={200} />
              </div>
            )}
          </div>
          <input type="hidden" name="service" value="addClient" />
          {state?.errors?.passport && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.passport}
            </p>
          )}
          <div className="flex flex-col my-5">
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
              <option disabled value="" selected className="text-sm font-sans">
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
          <div className="flex flex-row my-2 relative">
            <div className="flex flex-row w-32 items-center my-5">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Marital status:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            {["Single", "Married", "Divorced", "Widowed"].map(
              (maritalStatus, index) => (
                <div
                  className="flex flex-row items-center mr-10 gap-3"
                  key={maritalStatus}
                >
                  <Label
                    className="w-16 font-sans font-semibold text-gray-500"
                    labelName={maritalStatus}
                  />
                  <input
                    type="radio"
                    name="maritalStatus"
                    className="radio radio-primary text-sm w-4 h-4"
                    defaultChecked={index === 0}
                    value={maritalStatus}
                  />
                </div>
              )
            )}
          </div>
          {state?.errors?.sex && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.sex}
            </p>
          )}
          <div className="flex flex-row my-2 relative">
            <div className="flex flex-row w-32 items-center my-5">
              <Label
                className="font-sans font-semibold text-gray-500"
                labelName="Gender:"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>
            {["Male", "Female"].map((gender, index) => (
              <div className="flex flex-row items-center mr-10" key={gender}>
                <Label
                  className="w-16 font-sans font-semibold text-gray-500"
                  labelName={gender}
                />
                <input
                  type="radio"
                  name="gender"
                  className="radio radio-primary text-sm w-4 h-4"
                  defaultChecked={index === 0}
                  value={gender}
                />
              </div>
            ))}
          </div>
          {state?.errors?.gender && (
            <p className=" text-red-500 p-3 font-semibold">
              {state.errors.gender}
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
