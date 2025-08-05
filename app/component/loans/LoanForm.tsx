import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import { FormField, inputClasses, InputField, SelectField } from "../FormElements";



export default function LoanForm({
  reducerState,
  dispatch,
  loanProduct,
  fetchClients,
  handleClientSelect,
  calculateProcessingAndAdvanceFee,
  getLoanInfomation,
  calculateNextPayment,
  handleClick,
}: any) {
  return (
    <div role="tabpanel" className="tab-content block p-10 relative">
      {/* Client */}
      <FormField label="Client" required>
        <button
          type="button"
          onClick={() =>
            dispatch({ type: "SET_IS_OPEN", payload: !reducerState.isOpen })
          }
          className={`${inputClasses} flex justify-between`}
        >
          {reducerState.selectedClient.first_name
            ? `${reducerState.selectedClient.first_name} ${reducerState.selectedClient.last_name}`
            : "Select client"}
          <MdOutlineKeyboardArrowDown size={20} />
        </button>
        {reducerState.isOpen && (
          <div className="absolute z-10 w-full top-28 bg-white border border-gray-200 rounded-md shadow-lg">
            <input
              type="text"
              placeholder="Search..."
              value={reducerState.searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                dispatch({ type: "SET_SEARCH_TERM", payload: value });
                fetchClients(value);
              }}
              className={`${inputClasses} border-b`}
            />
            <ul className="max-h-40 overflow-hidden w-full">
              {reducerState.clients.length > 0 ? (
                reducerState.clients.map((client: any) => (
                  <li
                    key={client.systemId}
                    onClick={() => {
                      handleClientSelect(client);
                      dispatch({
                        type: "SET_SELECTED_CLIENT",
                        payload: client,
                      });
                      dispatch({
                        type: "SET_CLIENT",
                        payload: client.systemId,
                      });
                      dispatch({ type: "SET_IS_OPEN", payload: false });
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
        <input
          type="hidden"
          name="client"
          defaultValue={reducerState.selectedClient.systemId}
        />
      </FormField>
      {reducerState?.errors?.client && (
        <p className="text-red-500 text-sm p-1 font-semibold">
          {reducerState.errors.client}
        </p>
      )}

      {/* Loan Product */}
      <FormField label="Loan Product" required>
        {/* <select
          name="loanProduct"
          value={reducerState.loanProduct}
          className={`${inputClasses} cursor-pointer`}
          onChange={(e) =>
            dispatch({ type: "SET_LOADING_PRODUCT", payload: e.target.value })
          }
        >
          <option disabled value="">
            Select Loan Product
          </option>
          {loanProduct && loanProduct.length > 0 ? (
            loanProduct.map((loan: any) => (
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
        </select> */}
        <SelectField
          name="loanProduct"
          value={reducerState.loanProduct}
           onChange={(e:any) =>
            dispatch({ type: "SET_LOAN_PRODUCT", payload: e.target.value })
          }
          options={loanProduct}
          placeholder="Select Loan Product"
        />
      </FormField>
      {reducerState?.errors?.loanProduct && (
        <p className="text-red-500 text-sm p-1 font-semibold">
          {reducerState.errors.loanProduct}
        </p>
      )}

      {/* Terms */}
      <div className="flex flex-row flex-grow gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
        <FormField label="Principal" required>
          <InputField
            name="principal"
            value={reducerState.principal}
            placeholder="Enter loan term"
            onChange={(e: any) => {
              const val = Number(e.target.value);
              dispatch({ type: "SET_PRINCIPAL", payload: val });
              const [processingFee, advanceFee] =
                calculateProcessingAndAdvanceFee(val);
              dispatch({ type: "SET_PROCESSING_FEE", payload: processingFee });
              dispatch({ type: "SET_ADVANCE_FEE", payload: advanceFee });
            }}
          />
          {reducerState?.errors?.principal && (
            <p className=" text-red-500 p-1 text-sm font-semibold">
              {reducerState.errors.principal}
            </p>
          )}
        </FormField>

        <FormField label="Fund" required>
          <SelectField
            name="fund"
            value={reducerState.fund}
            onChange={(e: any) =>
              dispatch({ type: "SET_FUND", payload: e.target.value })
            }
            options={["Bank", "Cash"]}
            placeholder="Select Fund"
          />
          {reducerState?.errors?.fund && (
            <p className=" text-red-500 p-1 text-sm font-semibold">
              {reducerState.errors.fund}
            </p>
          )}
        </FormField>
      </div>
      <div className="flex flex-row flex-grow gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
        <FormField label="Loan Term" required>
          <InputField
            type="number"
            name="loanTerms"
            value={reducerState.loanTerms}
            placeholder="Enter Loan Terms"
            onChange={(e: any) =>
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
        </FormField>

        <FormField label="Repayment Frequency" required>
          <InputField
            type="number"
            name="repaymentFrequency"
            value={reducerState.repaymentFrequency}
            placeholder="Enter Repayment Frequency"
            onChange={(e: any) =>
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
        </FormField>

        <FormField label="Type" required>
          <SelectField
            name="type"
            value={reducerState.type}
            onChange={(e: any) => {
              dispatch({
                type: "SET_INTEREST",
                payload: getLoanInfomation(e.target.value),
              });
              dispatch({ type: "SET_TYPE", payload: e.target.value });
            }}
            options={["Monthly"]}
            placeholder="Select type"
          />
          {reducerState?.errors?.type && (
            <p className=" text-red-500 p-3 text-sm font-semibold">
              {reducerState.errors.type}
            </p>
          )}
        </FormField>
      </div>
      <div className="flex flex-row flex-grow gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
        <FormField label="Interest Rate" required>
          <InputField
            type="number"
            name="interestRate"
            value={reducerState.interest}
            disabled
            placeholder="Loan Interest"
            onChange={(e: any) =>
              dispatch({
                type: "SET_INTEREST",
                payload: Number(e.target.value),
              })
            }
          />
        </FormField>

        <FormField label="Disbursement Date" required>
          <InputField
            type="date"
            name="expectedDisbursementDate"
            value={reducerState.expectedDisbursementDate}
            onChange={(e: any) => {
              const val = e.target.value;
              dispatch({ type: "SET_EXPECTED_DISBURSMENT_DATE", payload: val });
              const nextPaymentDate = calculateNextPayment(new Date(val));
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
        </FormField>
      </div>

      {/* Settings */}
      <div className="flex flex-row gap-3 my-5 tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
        <FormField label="Loan Officer" required>
          <select
            name="loanOfficer"
            value={reducerState.loanOfficer}
            onChange={(e: any) =>
              dispatch({ type: "SET_LOAN_OFFICER", payload: e.target.value })
            }
            className={`${inputClasses} cursor-pointer`}
          >
            <option disabled value="">
              Select Loan Officer
            </option>
            {reducerState.users.map((user: any) => (
              <option key={user.username} value={user.username}>
                {user.first_name} {user.other_names} {user.last_name}
              </option>
            ))}
          </select>
          {reducerState?.errors?.loanOfficer && (
            <p className=" text-red-500 text-sm p-3 font-semibold">
              {reducerState.errors.loanOfficer}
            </p>
          )}
        </FormField>

        <FormField label="Loan Purpose" required>
          <InputField
            name="loanPurpose"
            value={reducerState.loanPurpose}
            placeholder="Enter Loan Purpose"
            onChange={(e: any) =>
              dispatch({ type: "SET_LOAN_PURPOSE", payload: e.target.value })
            }
          />
          {reducerState?.errors?.loanPurpose && (
            <p className=" text-red-500 text-sm p-3 font-semibold">
              {reducerState.errors.loanPurpose}
            </p>
          )}
        </FormField>

        <FormField label="First Repayment date" required>
          <InputField
            name="expectedFirstRepaymentDate"
            value={reducerState.expectedFirstRepayment}
            placeholder="First Disbursement Date"
            readOnly
          />
        </FormField>
      </div>

      {/* Submit */}
      <button
        className="btn w-24 flex items-center  justify-center gap-3 bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900 text-white py-2 rounded-md focus:outline-none font-bold font-mono transition"
        type="button"
        onClick={handleClick}
      >
        NEXT
      </button>
    </div>
  );
}
