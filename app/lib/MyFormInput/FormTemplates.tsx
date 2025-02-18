"use client"

import React, { useState } from "react";

interface FormTemplatesProps {
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  category: string;
  placeholder: string;
  type: string;
  disabled?: boolean;
  name: string;
}

interface ButtonProps {
  type?: string | any;
  className: string;
  labelName?: string;
  buttonLabel?: string;
  disabled?: boolean;
}

interface ISelect {
  textContent: string;
  value: string;
}
interface SelectProps {
  selectLabel: string;
  options: ISelect[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  dynamicValue?: string;
  disabled?: boolean;
}

interface RadioProps {
  className: string;
  radioLabel: string;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  checked: boolean;
}

//input input-bordered flex items-center gap-2
export const MyTextInput: React.FC<FormTemplatesProps> = ({
  handleOnChange,
  value,
  category,
  placeholder,
  type,
  disabled,
  name,
}) => {
  return (
    <div className="w-2/3">

      <input
        type={type}
        className="block w-96 px-5 py-2 border-2 border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleOnChange(e)}
        disabled={disabled}
        name={name}
      />
    </div>
  );
};

//btn btn-xs sm:btn-sm md:btn-md lg:btn-lg

export const MyButton: React.FC<ButtonProps> = ({
  type,
  className,
  buttonLabel,
  disabled,
}) => {
  return (
    <button type={type} className={className} disabled>
      {buttonLabel}
    </button>
  );
};

export const Label: React.FC<ButtonProps> = ({ labelName, className }) => {
  return <span className={className}>{labelName}</span>;
};

export const MySelect: React.FC<SelectProps> = ({
  selectLabel,
  options,
  onChange,
  dynamicValue,
  disabled,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(""); // Initialize as an empty string for placeholder

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value); // Update state on change
    onChange(e); // Call the parent onChange callback
  };

  return (
    <div className="w-2/3 px-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {selectLabel}
      </label>
      <select
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={dynamicValue || selectedValue} // Bind to the state
        onChange={handleChange} // Handle onChange
        disabled={disabled}
      >
        <option disabled value="">
          Group Affiliations {/* Placeholder */}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.textContent}
          </option>
        ))}
      </select>
    </div>
  );
};

//toggle toggle-success
export const MyRadio: React.FC<RadioProps> = ({
  className,
  radioLabel,
  handleOnChange,
  value,
  checked,
}) => {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/5 px-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {radioLabel}
      </label>
      <input
        type="checkbox"
        className={className}
        onChange={handleOnChange}
        value={value}
        checked={checked}
      />
    </div>
  );
};
