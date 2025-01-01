import React from "react";

export const LoadingBars = () => {
  return (
    <div className="w-full h-screen bg-black bg-opacity-40 absolute flex justify-center items-center">
      <span className="loading loading-ball loading-xs"></span>
      <span className="loading loading-ball loading-sm"></span>
      <span className="loading loading-ball loading-md"></span>
      <span className="loading loading-ball loading-lg"></span>
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div>
      <span className="loading loading-spinner text-white"></span>
    </div>
  );
};

export const LoadingDivs = () => {
  return (
    <div className="flex w-52 flex-col gap-4 m-auto">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
};
