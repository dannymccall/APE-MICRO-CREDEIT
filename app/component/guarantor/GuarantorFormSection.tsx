import React from "react";
import Image from "next/image";
import { Label } from "@/app/lib/MyFormInput/FormTemplates"; // adjust import path to where your Label component is

interface Props {
  reducerState: {
    guarantorFullName: string;
    guarantorOccupation: string;
    guarantorUnionName: string;
    guarantorResidence: string;
    guarantorMobile: string;
    passport?: string;
  };
  dispatch: React.Dispatch<any>;
  state: {
    errors?: Record<string, string>;
  };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GuarantorFormSection: React.FC<Props> = ({
  reducerState,
  dispatch,
  state,
  handleFileChange,
}) => {
  const fields = [
    {
      label: "Full Name:",
      name: "guarantorFullName",
      placeholder: "Enter Full Name",
      type: "text",
      action: "SET_GUARANTOR_FULL_NAME",
    },
    {
      label: "Occupation",
      name: "guarantorOccupation",
      placeholder: "Enter Occupation",
      type: "text",
      action: "SET_GUARANTOR_OCCUPATION",
    },
    {
      label: "Union Name:",
      name: "guarantorUnionName",
      placeholder: "Enter Union Name",
      type: "text",
      action: "SET_GUARANTOR_UNION_NAME",
    },
    {
      label: "Residence:",
      name: "guarantorResidence",
      placeholder: "Enter Residence",
      type: "text",
      action: "SET_GUARANTOR_RESIDENCE",
    },
    {
      label: "Mobile:",
      name: "guarantorMobile",
      placeholder: "Enter Mobile",
      type: "text",
      action: "SET_GUARANTOR_MOBILE",
    },
  ];

  return (
    <>
      {fields.map((field) => (
        <div
          key={field.name}
          className="flex flex-row my-5 relative tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col"
        >
          <div className="flex flex-row w-32 gap-0 items-center">
            <Label
              className="font-sans font-semibold text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
              labelName={field.label}
            />
            <span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            className="block w-96 text-sm px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm tablet:w-96 desktop:w-96 laptop:w-96 phone:w-64"
            value={(reducerState as any)[field.name]}
            onChange={(e) =>
              dispatch({
                type: field.action,
                payload: e.target.value,
              })
            }
          />
          {state?.errors?.[field.name] && (
            <p className="text-red-500 p-1 text-sm font-semibold">
              {state.errors[field.name]}
            </p>
          )}
        </div>
      ))}

      {/* Photo Upload */}
      <div className="w-full flex flex-col mb-10">
        <div className="flex flex-row relative tablet:flex-col desktop:flex-row laptop:flex-row phone:flex-col">
          <div className="flex flex-row w-32 items-center">
            <Label
              className="font-sans font-medium text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
              labelName="Photo:"
            />
            <span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="file"
            name="guarantorPassport"
            onChange={handleFileChange}
            className="file-input text-sm font-sans block w-96 px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm tablet:w-96 desktop:w-96 laptop:w-96 phone:w-64"
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
        {state?.errors?.guarantorPassport && (
          <p className="text-red-500 p-3 text-sm font-medium">
            {state.errors.guarantorPassport}
          </p>
        )}
      </div>
    </>
  );
};

export default GuarantorFormSection;
