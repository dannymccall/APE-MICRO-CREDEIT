import React, { useState } from "react";

interface SearchInputProps {
  handleOnclickSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonLabel?: string;
  fetchAll: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  handleOnclickSearch,
  placeholder = "Search",
  className = "desktop:w-1/2 laptop:w-1/2 tablet:w-full phone:w-full",
  buttonLabel,
  fetchAll
}) => {
  const [query, setQuery] = useState("");

  function handleOnKeyUp(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      console.log("Enter pressed. Value:", e.currentTarget.value);
      // Your logic here, e.g., submit form or search
      handleOnclickSearch(e.currentTarget.value);
    }
  }

  return (
    <div className="flex justify-center gap-4 items-center mb-10">
      <button className="bg-violet-600 px-5 py-2 text-slate-50 rounded-md shadow-md active:scale-105 transition-all duration-300" onClick={fetchAll}>
        All {buttonLabel}
      </button>
      <label className={`input flex items-center gap-2  ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70 text-violet-700 text-lg"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          />
        </svg>
        <input
          type="text"
          className="grow block text-sm w-full px-5 py-2  rounded-md shadow-sm focus:outline-violet-800 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={handleOnKeyUp}
        />
        <button
          className="bg-violet-600 text-slate-50 px-4 py-1 rounded-md shadow-md active:scale-105 transition-all duration-300"
          onClick={() => handleOnclickSearch(query)}
        >
          Search
        </button>
      </label>
    </div>
  );
};

export default SearchInput;
