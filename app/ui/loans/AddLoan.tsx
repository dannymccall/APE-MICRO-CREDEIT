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
import { LoadingSpinner } from "@/app/component/Loading";
import { useRouter } from "next/navigation";
import {
  makeRequest,
  calculateProcessingAndAdvanceFee,
  calculateNextPayment,
  blobToFile,
} from "@/app/lib/utils";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { processLoan } from "@/app/actions/loanAuth";
import {
  initialState,
  useReducerHook,
  getLoanInfomation,
  CustomFile,
} from "@/app/lib/customHooks";
import { startTransition } from "react";

export interface IAddUser {
  route: string;
}
import { formatZodErrors, extractFormFields } from "@/app/lib/utils";
import { loanSchema } from "@/app/lib/definitions";

const AddLoan: React.FC<IAddUser> = ({ route }) => {
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
  const router = useRouter();

  const [reducerState, dispatch] = useReducer(useReducerHook, initialState);
  const formData: FormData | any = new FormData();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const [clientResponse, usersResponse] = await Promise.all([
          makeRequest("/api/clients", { method: "GET", cache: "no-store" }),
          makeRequest("/api/users", { method: "GET", cache: "no-store" }),
        ]);

        dispatch({
          type: "SET_CLIENTS",
          payload: clientResponse.data.filter(
            (client: any) => client.client_status === "active"
          ),
        });
        dispatch({ type: "SET_USERS", payload: usersResponse.data });
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []); // Empty dependency array ensures this runs once on mount

  // Monitor changes to `branches`
  useEffect(() => {
    console.log(reducerState.users, reducerState.clients);
  }, [reducerState.clients]); // Logs whenever `branches` changes // Empty dependency array ensures this runs once on mount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    console.log(file);
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

    if (state?.message) {
      setShowMessage(true);
      // dispatch({type: "SET_ACTIVE_TAB", payload: 0})
      dispatch({type: "RESET_STATE"})
      router.refresh()
      timeout = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }

    // Cleanup the timeout when the component unmounts or when state changes
    return () => clearTimeout(timeout);
  }, [state?.message, router]); // Depend on state.message to run when it changes

  const onClick = () => {
    router.push("/manage-client");
  };


  const loanProduct = [
    { name: "Business Loan (monthly repayment - 10.67%)" },
    { name: "Business Loan (weekly repayment - 2.67%)" },
    { name: "Business Loan (daily repayment - 0.5%)" },
    { name: "Vehicle Loan (monthly repayment - 10.67%)" },
    { name: "Vehicle Loan (weekly repayment - 2.67%)" },
    { name: "Vehicle Loan (daily repayment - 0.5%)" },
  ];

  async function fetchClients(search: string) {
    if (search) {
      const clients = await makeRequest(`/api/clients?search=${search}`, {
        method: "GET",
      });
      console.log({ clients });
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
        "interestRate"
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
        console.log(`${key}: ${value}`);
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
          message={state?.message}
          Icon={FaCircleCheck}
          title="User Addition Response"
        />
      )}
      <div className="w-full h-full p-14">
        <form
          className="bg-white shadow-md w-full border-t-4 border-t-violet-900 py-3 px-7"
          ref={formRef}
          // action={action}
          onSubmit={handleSubmit}
        >
          <div role="tablist" className="tabs h-full">
            {["Loan Application", "Guarantor"].map((tab, index) => (
              <button
                key={index}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_TAB", payload: Number(index) })
                }
                className={`tab font-mono transition duration-300 ease-in-out ${
                  reducerState.activeTab === index
                    ? "bg-violet-900 text-white rounded-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {reducerState.activeTab === 0 && (
            <div role="tabpanel" className="tab-content block p-10">
              <div className="w-full h-full">
                <div role="tabpanel" className="tab-content block">
                  <div className="flex flex-col  my-5 relative">
                    <div className="flex flex-row w-32 gap-0 items-center">
                      <Label
                        className="font-sans font-semibold text-gray-500 text-sm"
                        labelName="Client"
                      />
                      <span className="text-red-500 ml-1">*</span>
                    </div>

                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch({ 
                            type: "SET_IS_OPEN",
                            payload: !reducerState.isOpen,
                          })
                        }
                        className=" w-full px-5 py-2 flex justify-between text-sm border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {reducerState.selectedClient
                          ? `${reducerState.selectedClient.first_name} ${reducerState.selectedClient.last_name} `
                          : "Select client"}
                        <MdOutlineKeyboardArrowDown size={20} />
                      </button>
                      {reducerState.isOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={reducerState.searchTerm}
                            onChange={(e) => {
                              dispatch({
                                type: "SET_SEARCH_TERM",
                                payload: e.target.value,
                              });
                              fetchClients(reducerState.searchTerm);
                            }}
                            className="block w-full px-5 py-2 text-sm border-b border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <ul className="max-h-40 overflow-y-auto">
                            {reducerState.clients.length > 0 ? (
                              reducerState.clients.map((client: any) => (
                                <li
                                  key={client.systemId}
                                  onClick={() => {
                                    // setSelectedClient({
                                    //   clientId: client.systemId,
                                    //   clientName: `${client.first_name} ${client.last_name}`,
                                    // });
                                    handleClientSelect(client);
                                    dispatch({
                                      type: "SET_SELECTED_CLIENT",
                                      payload: client,
                                    });
                                    dispatch({
                                      type: "SET_CLIENT",
                                      payload: client.systemId,
                                    });
                                    dispatch({
                                      type: "SET_IS_OPEN",
                                      payload: !reducerState.isOpen,
                                    });
                                  }}
                                  className="px-5 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white"
                                >
                                  {client.first_name} {client.last_name}
                                </li>
                              ))
                            ) : (
                              <li className="px-5 py-2 text-sm text-gray-500">
                                No clients available
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    <input
                      type="hidden"
                      name="client"
                      defaultValue={reducerState.selectedClient.systemId}
                    />
                  </div>
                  {reducerState?.errors?.client && (
                    <p className=" text-red-500 text-sm p-1 font-semibold">
                      {reducerState.errors.client}
                    </p>
                  )}
                  <div className="flex flex-col my-5 relative">
                    <div className="flex flex-row w-full gap-0 items-center">
                      <Label
                        className="font-sans font-semibold text-gray-500 text-sm"
                        labelName="Loan Product"
                      />
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                    <select
                      name="loanProduct"
                      value={reducerState.loanProduct}
                      className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_LOADING_PRODUCT",
                          payload: e.target.value,
                        })
                      }
                    >
                      <option disabled value="">
                        Select Loan Product
                      </option>
                      {loanProduct && loanProduct.length > 0 ? (
                        loanProduct.map((loan) => (
                          <option
                            value={loan.name}
                            key={loan.name}
                            className="text-sm font-sans"
                          >
                            {loan.name}
                          </option>
                        ))
                      ) : (
                        <option disabled value="">
                          No titles available
                        </option>
                      )}
                    </select>
                  </div>
                  {reducerState?.errors?.loanProduct && (
                    <p className=" text-red-500 text-sm p-1 font-semibold">
                      {reducerState.errors.loanProduct}
                    </p>
                  )}
                  <div className="flex flex-col my-5 gap-3">
                    <div className="flex flex-row w-32 gap-0 items-center">
                      <Label
                        className="font-sans font-bold text-black"
                        labelName="Terms"
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex flex-row gap-3">
                        <div className="w-full">
                          <div className="flex flex-row w-32 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Principal"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <input
                            type="text"
                            className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={"Enter loan term"}
                            name="principal"
                            value={reducerState.principal}
                            onChange={(e) => {
                              dispatch({
                                type: "SET_PRINCIPAL",
                                payload: Number(e.target.value),
                              });
                              const [processingFee, advanceFee] =
                                calculateProcessingAndAdvanceFee(
                                  Number(e.target.value)
                                );
                              dispatch({
                                type: "SET_PROCESSING_FEE",
                                payload: Number(processingFee),
                              });
                              dispatch({
                                type: "SET_ADVANCE_FEE",
                                payload: Number(advanceFee),
                              });
                            }}
                          />
                          {reducerState?.errors?.principal && (
                            <p className=" text-red-500 p-1 text-sm font-semibold">
                              {reducerState.errors.principal}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row w-32 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Fund"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <select
                            name="fund"
                            className="block w-full text-sm font-sans px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                            value={reducerState.fund}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_FUND",
                                payload: e.target.value,
                              })
                            }
                          >
                            <option
                              disabled
                              value=""
                              selected
                              className="text-sm font-sans"
                            >
                              Select Fund
                            </option>
                            {["Bank", "Cash"].map((fund: any) => (
                              <option
                                value={fund}
                                key={fund}
                                className="text-sm font-sans"
                              >
                                {fund}
                              </option>
                            ))}
                          </select>
                          {reducerState?.errors?.fund && (
                            <p className=" text-red-500 p-1 text-sm font-semibold">
                              {reducerState.errors.fund}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex flex-row gap-3">
                        <div className="w-full">
                          <div className="flex flex-row w-32 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Loan Term"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <input
                            type="number"
                            className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={"Enter Loan Terms"}
                            name="loanTerms"
                            value={reducerState.loanTerms}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_LOAN_TERMS",
                                payload: Number(e.target.value),
                              })
                            }
                          />
                          {reducerState?.errors?.loanTerms && (
                            <p className=" text-red-500 p-3 text-sm font-semibold">
                              {reducerState.errors.loanTerms}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row w-56 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Repayment Frequency"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <input
                            type="number"
                            className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={"Enter Repayment Frequency"}
                            name="repaymentFrequency"
                            value={reducerState.repaymentFrequency}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_REPAYMENT_FREQUENCY",
                                payload: Number(e.target.value),
                              })
                            }
                          />
                          {reducerState?.errors?.repaymentFrequency && (
                            <p className=" text-red-500 p-3 text-sm font-semibold">
                              {reducerState.errors.repaymentFrequency}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row w-32 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Type"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <select
                            name="type"
                            className="block w-full text-sm font-sans px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                            value={reducerState.type}
                            onChange={(e) => {
                              dispatch({
                                type: "SET_INTEREST",
                                payload: getLoanInfomation(e.target.value),
                              });
                              dispatch({
                                type: "SET_TYPE",
                                payload: e.target.value,
                              });
                            }}
                          >
                            <option
                              disabled
                              value=""
                              selected
                              className="text-sm font-sans"
                            >
                              Select type
                            </option>
                            {["Months"].map((frequency: any) => (
                              <option
                                value={frequency}
                                key={frequency}
                                className="text-sm font-sans"
                              >
                                {frequency}
                              </option>
                            ))}
                          </select>
                          {reducerState?.errors?.type && (
                            <p className=" text-red-500 p-3 text-sm font-semibold">
                              {reducerState.errors.type}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex flex-row gap-3">
                        <div className="w-full">
                          <div className="flex flex-row w-32 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Interest Rate"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <input
                            type="number"
                            className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={"Loan Interest"}
                            name="interestRate"
                            disabled
                            value={reducerState.interest}
                            onChange={(e) => {
                              dispatch({
                                type: "SET_INTEREST",
                                payload: Number(e.target.value),
                              });
                            }}
                          />
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row w-60 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Expected Disbursement Date"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <input
                            type="date"
                            className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={"Enter Disbursment Date"}
                            name="expectedDisbursementDate"
                            value={reducerState.expectedDisbursementDate}
                            onChange={(e) => {
                              dispatch({
                                type: "SET_EXPECTED_DISBURSMENT_DATE",
                                payload: e.target.value,
                              });
                              const nextPaymentDate = calculateNextPayment(
                                new Date(e.target.value)
                              );
                              dispatch({
                                type: "SET_FIRST_REPAYMENT_DATE",
                                payload: nextPaymentDate,
                              });
                            }}
                          />
                          {reducerState?.errors?.expectedDisbursementDate && (
                            <p className=" text-red-500 p-3 text-sm font-semibold">
                              {reducerState.errors.expectedDisbursementDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col my-5 gap-3">
                    <div className="flex flex-row w-32 gap-0 items-center">
                      <Label
                        className="font-sans font-bold text-black"
                        labelName="Settings"
                      />
                    </div>
                    <div className="w-full"></div>
                    <div className="w-full">
                      <div className="flex flex-row gap-3">
                        <div className="w-full">
                          <div className="flex flex-row w-32 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Loan Officer"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <select
                            name="loanOfficer"
                            className="block w-full text-sm font-sans px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                            value={reducerState.loanOfficer}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_LOAN_OFFICER",
                                payload: e.target.value,
                              })
                            }
                          >
                            <option
                              disabled
                              value=""
                              selected
                              className="text-sm font-sans"
                            >
                              Select Loan Officer
                            </option>
                            {reducerState.users.map((user: any) => (
                              <option
                                value={user.username}
                                key={user.username}
                                className="text-sm font-sans"
                              >
                                {user.first_name} {user.other_names}{" "}
                                {user.last_name}
                              </option>
                            ))}
                          </select>
                          {reducerState?.errors?.loanOfficer && (
                            <p className=" text-red-500 text-sm p-3 font-semibold">
                              {reducerState.errors.loanOfficer}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row w-56 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Loan Purpose"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <input
                            type="text"
                            className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={"Enter Loan Purpose"}
                            name="loanPurpose"
                            value={reducerState.loanPurpose}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_LOAN_PURPOSE",
                                payload: e.target.value,
                              })
                            }
                          />
                          {reducerState?.errors?.loanPurpose && (
                            <p className=" text-red-500 text-sm p-3 font-semibold">
                              {reducerState.errors.loanPurpose}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row w-52 gap-0 items-center">
                            <Label
                              className="font-sans font-semibold text-gray-500 text-sm"
                              labelName="Expected First Repayment date"
                            />
                            <span className="text-red-500 ml-1">*</span>
                          </div>
                          <input
                            type="text"
                            className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={"First Disbursement Date"}
                            name="expectedFirstRepaymentDate"
                            readOnly
                            value={reducerState.expectedFirstRepayment}
                            onChange={(e) => {
                              dispatch({
                                type: "SET_FIRST_REPAYMENT_DATE",
                                payload: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col my-5 gap-3">
                    <div className="flex flex-row w-32 gap-0 items-center">
                      <Label
                        className="font-sans font-bold text-black"
                        labelName="Charges"
                      />
                    </div>
                    <div className="w-full"></div>
                    <div className="w-full">
                      <div className="flex flex-row gap-3">
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
                  </div>
                  <button
                    className={`btn w-24 flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
                    type="button"
                    onClick={handleClick}
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          )}
          {reducerState.activeTab === 1 && (
            <div role="tabpanel" className="tab-content block p-10">
              <div className="w-full h-full">
                <div className="flex flex-row items-center my-5 relative">
                  <div className="flex flex-row w-32 gap-0 items-center">
                    <Label
                      className="font-sans font-semibold text-gray-800"
                      labelName="Full Name:"
                    />
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <input
                    type="text"
                    className="block w-96 text-sm px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="guarantorFullName"
                    placeholder="Enter Full Name"
                    value={reducerState.guarantorFullName}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_GUARANTOR_FULL_NAME",
                        payload: e.target.value,
                      })
                    }
                  />
                </div>
                {state?.errors?.guarantorFullName && (
                  <p className=" text-red-500 p-1 text-sm font-semibold">
                    {state.errors.guarantorFullName}
                  </p>
                )}
                <div className="flex flex-row items-center my-5 relative">
                  <div className="flex flex-row w-32 gap-0 items-center">
                    <Label
                      className="font-sans font-semibold text-gray-800"
                      labelName="Occupation"
                    />
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <input
                    type="text"
                    className="block w-96 text-sm px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="guarantorOccupation"
                    placeholder="Enter Occupation"
                    value={reducerState.guarantorOccupation}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_GUARANTOR_OCCUPATION",
                        payload: e.target.value,
                      })
                    }
                  />
                </div>
                {state?.errors?.guarantorOccupation && (
                  <p className=" text-red-500 p-1 text-sm font-semibold">
                    {state.errors.guarantorOccupation}
                  </p>
                )}
                <div className="flex flex-row items-center my-5">
                  <div className="flex flex-row w-32 gap-0 items-center">
                    <Label
                      className="font-sans font-semibold text-gray-800"
                      labelName="Union Name:"
                    />
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <input
                    type="text"
                    className="block w-96 text-sm px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={"Enter Union Name"}
                    name="guarantorUnionName"
                    value={reducerState.guarantorUnionName}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_GUARANTOR_UNION_NAME",
                        payload: e.target.value,
                      })
                    }
                  />
                </div>
                {state?.errors?.guarantorUnionName && (
                  <p className=" text-red-500 p-1 text-sm font-semibold">
                    {state.errors.guarantorUnionName}
                  </p>
                )}
                <div className="flex flex-row items-center my-5 relative">
                  <div className="flex flex-row w-32 gap-0 items-center">
                    <Label
                      className="font-sans font-semibold text-gray-800"
                      labelName="Residence:"
                    />
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <input
                    type="text"
                    className="block text-sm w-96 px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="guarantorResidence"
                    placeholder={"Enter Residence"}
                    value={reducerState.guarantorResidence}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_GUARANTOR_RESIDENCE",
                        payload: e.target.value,
                      })
                    }
                  />
                </div>
                {state?.errors?.guarantorResidence && (
                  <p className=" text-red-500 p-1 text-sm font-semibold">
                    {state.errors.guarantorResidence}
                  </p>
                )}
                <div className="flex flex-row items-center my-5 relative">
                  <div className="flex flex-row w-32 gap-0 items-center">
                    <Label
                      className="font-sans font-semibold text-gray-800"
                      labelName="Mobile:"
                    />
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <input
                    type="text"
                    className="block text-sm w-96 px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="guarantorMobile"
                    placeholder={"Enter Mobile"}
                    value={reducerState.guarantorMobile}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_GUARANTOR_MOBILE",
                        payload: e.target.value,
                      })
                    }
                  />
                </div>
                {state?.errors?.guarantorMobile && (
                  <p className=" text-red-500 p-1 text-sm font-semibold">
                    {state.errors.guarantorMobile}
                  </p>
                )}
                <div className="w-full flex flex-col mb-10">
                  <div className="flex flex-row  items-center relative">
                    <div className="flex flex-row w-32 items-center ">
                      <Label
                        className="font-sans font-semibold text-gray-800"
                        labelName="Passport:"
                      />
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                    <input
                      type="file"
                      className="file-input text-sm font-sans block w-96 px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      name="guarantorPassport"
                      onChange={handleFileChange}
                    />
                  </div>
                  {reducerState.passport && (
                    <div className="relative left-0 top-5">
                      <Image
                        src={reducerState.passport}
                        alt="passport"
                        width={200}
                        height={200}
                      />
                    </div>
                  )}
                </div>
                {state?.errors?.guarantorPassport && (
                  <p className=" text-red-500 p-3 text-sm font-semibold">
                    {state.errors.guarantorPassport}
                  </p>
                )}
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
