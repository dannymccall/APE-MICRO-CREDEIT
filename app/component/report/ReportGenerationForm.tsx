import { makeRequest } from "@/app/lib/helperFunctions";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import React, { useCallback, useEffect, useState } from "react";

type ReportState =
  | {
      errors?: {
        startDate?: string[];
        endDate?: string[];
        filters?: string[];
      };

      response?: { message?: string; data?: [] };
    }
  | undefined;

interface ReportFormProps {
  state: ReportState;
  action: (payLoad: FormData) => void;
  startDate: string;
  endDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  toggleFilter: (filter: string) => void;
  pending: boolean;
  selectedFilters: string[];
}
const ReportGenerationForm = ({
  state,
  action,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  toggleFilter,
  pending,
  selectedFilters,
}: ReportFormProps) => {
  const [staff, setStaff] = useState<any[]>([]);

  const fetchUsers = useCallback(async () => {
    const users = await makeRequest("/api/users", { method: "GET" });
    setStaff(users.data);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const availableFilters:Array<{value:string, key:string}> = [
    {value:"disbursement", key:"disbursement"},
    {value:"repayments", key:"repayments"},
    {value:"arrears", key:"arrears"},
    {value:"outstanding", key:"outstanding"},
    {value:"default", key:"default"},
    {value:"payments",key:"payments"},
    {value:"matured loans",key:"matured_loans"}
  ];
  return (
    <div className=" flex flex-col bg-white m-4 p-5 gap-2 rounded-md">
      <h1 className="font-mono font-semibold text-lg">Generate Report</h1>
      <p className=" text-red-500 p-1 font-semibold text-sm">
        {state?.errors && state?.response?.message}
      </p>
      <form action={action}>
        <div className="w-full flex phone:flex-col desktop:flex-row laptop:flex-row tablet:flex-col gap-5">
          <div className="w-full flex flex-col justify-center ">
            <Label
              className="font-sans w-40 font-medium text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
              labelName="Start Date:"
            />
            <input
              type="date"
              className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <p className=" text-red-500 p-1 font-semibold text-sm">
              {state?.errors?.startDate && state.errors.startDate}
            </p>
          </div>
          <div className="w-full flex flex-col justify-center">
            <Label
              className="font-sans w-40 font-medium text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
              labelName="End Date:"
            />
            <input
              type="date"
              className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <p className=" text-red-500 p-1 font-semibold text-sm">
              {state?.errors?.startDate && state.errors.endDate}
            </p>
          </div>

          <div className="w-full flex flex-col">
            <Label
              className="font-sans w-20 font-medium text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
              labelName="Filters:"
            />
            <div className="w-full flex gap-2 phone:flex-col desktop:flex-row laptop:flex-row tablet:flex-row flex-wrap">
              {availableFilters.map((filter, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleFilter(filter.key)}
                  className={`btn btn-sm ${
                    selectedFilters.includes(filter.key)
                      ? "bg-violet-600 text-white"
                      : "bg-white text-violet-600"
                  } flex flex-row justify-between  border-2 border-violet-600 m-1 px-2 py-1 rounded-md font-medium hover:bg-violet-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-opacity-50`}
                  disabled={pending}
                >
                  {filter.value}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-col justify-center ">
            <Label
              className="font-sans w-40 font-medium text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
              labelName="Staff:"
            />
            <select
              name="staff"
              className="block w-full text-sm font-sans px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            >
              <option  value="" className="text-sm font-sans">
                Select Loan Officer
              </option>
              {staff.map((user: any) => (
                <option
                  value={user._id}
                  key={user.username}
                  className="text-sm font-sans"
                >
                  {user.first_name} {user.other_names} {user.last_name}
                </option>
              ))}
            </select>
           
          </div>
          <input type="hidden" name="filters" value={selectedFilters} />
        </div>
        <button
          type="submit"
          className="btn btn-md mt-5 bg-violet-500 text-slate-100"
        >
          Generate
        </button>
      </form>
    </div>
  );
};

export default ReportGenerationForm;
