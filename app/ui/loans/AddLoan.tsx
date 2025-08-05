"use client";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import React, {
  useActionState,
  useEffect,
  useState,
  useRef,
  useReducer,
} from "react";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import Image from "next/image";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { LoadingSpinner } from "@/app/component/Loaders/Loading";
import { useRouter } from "next/navigation";
import {
  makeRequest,
  calculateProcessingAndAdvanceFee,
  calculateNextPayment,
  blobToFile,
} from "@/app/lib/helperFunctions";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { processLoan } from "@/app/actions/loanAuth";
import {
  initialState,
  useReducerHook,
  CustomFile,
} from "@/app/lib/hooks/useReducer";
import { startTransition } from "react";
import { io } from "socket.io-client";
import { useLogginIdentity } from "@/app/lib/hooks/useLogginIdentity";
import { formatZodErrors, extractFormFields } from "@/app/lib/helperFunctions";
import { loanSchema } from "@/app/lib/definitions";
import GuarantorFormSection from "@/app/component/guarantor/GuarantorFormSection";
import LoanForm from "@/app/component/loans/LoanForm";
import { usefetchBranches } from "@/app/lib/hooks/useFetchBranches";
import { useSocket } from "@/app/lib/hooks/useSocket";
import { getLoanInfomation } from "@/app/lib/helperFunctions";
const AddLoan = () => {
  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },

    {
      name: "add-loan",
      href: "/add-loan",
    },
  ];

  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(processLoan, undefined);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [hasApplicantFilled, setHasApplicantFilled] = useState<boolean>(false);
  const router = useRouter();
  // const socket = useSocket();
  const [reducerState, dispatch] = useReducer(useReducerHook, initialState);
  const formData: FormData | any = new FormData();
  const logginIdentity = useLogginIdentity();
  useEffect(() => {
    (async () => {
      const { clientResponse, usersResponse } = await usefetchBranches();

      dispatch({
        type: "SET_CLIENTS",
        payload: clientResponse.data.filter(
          (client: any) => client.client_status === "active"
        ),
      });
      dispatch({
        type: "SET_USERS",
        payload: usersResponse.data.filter((staff: any) =>
          staff.roles.includes("Loan officer")
        ),
      });
    })();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      // Create a URL for the file and update the stat
      const fileUrl: CustomFile | any = URL.createObjectURL(file);
      dispatch({ type: "SET_PASSPORT", payload: fileUrl });
      dispatch({ type: "SET_GUARANTOR_PASSPORT", payload: fileUrl });
    }
  };

  // useEffect(() => {
  //   fetchBranches();
  // },[]);
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (state?.response?.success) {
      setShowMessage(true);
      dispatch({ type: "SET_ACTIVE_TAB", payload: 0 });
      setHasApplicantFilled(false);
      dispatch({ type: "RESET_STATE" });
      if (logginIdentity && logginIdentity.userRoles.includes("Loan officer")) {
        const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);
        socket.emit(
          "newLoanApplicationSubmited",
          "A new loan application awaits your approval"
        );
      }
      router.refresh();

      timeout = setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [state?.response?.message, router]); // Depend on state.message to run when it changes

  const onClick = () => {
    router.push("/manage-loan");
  };

  const loanProduct = [
    "Business Loan",
    "Vehicle Loan",
  ];

  async function fetchClients(search: string) {
    if (search) {
      const clients = await makeRequest(`/api/clients?search=${search}`, {
        method: "GET",
      });
      // console.log({ clients });
      // setClients(clients.data);
      dispatch({ type: "SET_CLIENTS", payload: clients.data });
    }
  }
  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    // Invoke action with form data and dynamic dropdown values
    if (formRef.current) {
      const expectedFields = [
        "client",
        "loanProduct",
        "principal",
        "fund",
        "loanTerms",
        "repaymentFrequency",
        "type",
        "expectedDisbursementDate",
        "loanOfficer",
        "loanPurpose",
        "registrationFee",
        "advanceFee",
        "processingFee",
        "expectedFirstRepaymentDate",
        "guarantorMobile",
        "interestRate",
      ];

      const formData = new FormData(formRef.current); // Extract all form values

      const body = extractFormFields(formData, expectedFields);
      console.log(body);
      const validateLoanFormFields = loanSchema.safeParse(body);

      if (!validateLoanFormFields.success) {
        const errors = formatZodErrors(
          validateLoanFormFields.error.flatten().fieldErrors
        );
        dispatch({ type: "SET_FORM_ERRORS", payload: errors });
        return;
      }

      dispatch({ type: "SET_ACTIVE_TAB", payload: Number(1) });
      setHasApplicantFilled(true);
      dispatch({ type: "SET_FORM_ERRORS", payload: {} });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Manually create FormData from reducerState (assuming reducerState holds form data)

    // Assuming reducerState contains the relevant form fields
    Object.keys(reducerState).forEach((key: any) => {
      const value = reducerState[key];
      if (value !== undefined && value !== null) {
        // console.log(`${key}: ${value}`);
        formData.append(key, value); // Append each form field from state
      }
    });

    // Start a transition to update the state in the correct context

    formData.append("service", "addLoan");
    startTransition(() => {
      action(formData); // Dispatch your async action here
    });
  };

  const handleClientSelect = (client: {
    systemId: string;
    first_name: string;
    last_name: string;
  }) => {
    const clientId = client.systemId;
    const clientName = `${client.first_name} ${client.last_name}`;

    dispatch({
      type: "SET_SELECTED_CLIENT",
      payload: { clientId, clientName },
    });
  };

  return (
    <>
      <InfoHeaderComponent
        route={"ADD LOAN"}
        links={breadcrumbsLinks}
        title="Manage loan"
        onClick={onClick}
      />
      {showMessage && (
        <Toast
          message={state?.response?.message}
          Icon={FaCircleCheck}
          title="User Addition Response"
        />
      )}
      <div className="w-full h-full p-14 phone:p-2 phone:min-w-screen desktop:p-14 laptop:p-10 tablet:p-5">
        <form
          className="bg-white w-full border-t-4 border-t-violet-900 py-3 px-7 phone:py:1 phone:px-2 laptop:py-2 laptop:px-4 desktop:py-3 desktop:px-7"
          ref={formRef}
          // action={action}
          onSubmit={handleSubmit}
        >
          <div role="tablist" className="tabs h-full w-1/2 gap-5">
            {["Applicant", "Guarantor"].map((tab, index) => (
              <button
                key={index}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_TAB", payload: Number(index) })
                }
                className={`tab font-mono transition duration-300 ease-in-out ${
                  reducerState.activeTab === index
                    ? "bg-violet-900 text-white rounded-md"
                    : "bg-gray-200 hover:bg-gray-300"
                } ${
                  tab === "Guarantor" && !hasApplicantFilled ? "tooltip" : ""
                }`}
                type="button"
                disabled={index == 1 && !hasApplicantFilled}
                data-tip="Please fill the applicant form first!"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {reducerState.activeTab === 0 && (
            <LoanForm
              reducerState={reducerState}
              dispatch={dispatch}
              handleClientSelect={handleClientSelect}
              loanProduct={loanProduct}
              calculateProcessingAndAdvanceFee={
                calculateProcessingAndAdvanceFee
              }
              getLoanInfomation={getLoanInfomation}
              calculateNextPayment={calculateNextPayment}
              handleClick={handleClick}
              fetchClients={fetchClients}
            />
          )}
          {/* <div className="flex flex-col my-5 gap-3">
            <div className="flex flex-row w-32 gap-0 items-center">
              <Label
                className="font-sans font-bold text-black"
                labelName="Charges"
              />
            </div>
            <div className="w-full"></div>
            <div className="w-full">
              <div className="flex flex-row gap-3 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
                <div className="w-full">
                  <div className="flex flex-row w-32 gap-0 items-center">
                    <Label
                      className="font-sans font-semibold text-gray-500 text-sm"
                      labelName="Processing Fee"
                    />
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <input
                    type="number"
                    className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={"Enter Processing Fee"}
                    name="processingFee"
                    value={
                      reducerState.processingFee
                        ? reducerState.processingFee.toFixed(2)
                        : reducerState.processingFee
                    }
                    readOnly
                    onChange={(e) => {
                      dispatch({
                        type: "SET_PROCESSING_FEE",
                        payload: Number(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-row w-56 gap-0 items-center">
                    <Label
                      className="font-sans font-semibold text-gray-500 text-sm"
                      labelName="Advance Fee"
                    />
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <input
                    type="number"
                    className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={"Enter Advance Fee"}
                    name="advanceFee"
                    value={
                      reducerState.advanceFee
                        ? reducerState.advanceFee.toFixed(2)
                        : reducerState.advanceFee
                    }
                    readOnly
                    onChange={() => {}}
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-row w-52 gap-0 items-center">
                    <Label
                      className="font-sans font-semibold text-gray-500 text-sm"
                      labelName="Registration Fee"
                    />
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <input
                    type="number"
                    className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={"Enter Registration Fee"}
                    name="registrationFee"
                    value={reducerState.registrationFee}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_REGISTRATION_FEE",
                        payload: Number(e.target.value),
                      })
                    }
                  />
                  {reducerState?.errors?.registrationFee && (
                    <p className=" text-red-500 text-sm p-3 font-semibold">
                      {reducerState.errors.registrationFee}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div> */}

          {reducerState.activeTab === 1 && (
            <div role="tabpanel" className="tab-content block p-10">
              <div className="w-full h-full">
                <GuarantorFormSection
                  reducerState={reducerState}
                  dispatch={dispatch}
                  state={state!}
                  handleFileChange={handleFileChange}
                />
                <button
                  className={`btn w-24 flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
                  type="submit"
                >
                  {pending && <LoadingSpinner />}
                  Save
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default AddLoan;
