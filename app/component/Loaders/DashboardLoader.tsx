import React from "react";

const DashboardLoader = () => {
  return (
    <main className="animate-pulse w-full h-full flex flex-col p-5 gap-10">
      <section className="flex flex-row w-full flex-wrap flex-grow-0  items-center justify-center">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-60 h-24 flex flex-col justify-between bg-gray-200 m-2  rounded-md px-2 py-3"
          ></div>
        ))}
      </section>
      <section className="flex flex-row justify-center w-full items-center flex-wrap mt-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col glass items-center justify-between bg-gray-200  text-slate-50 p-3 w-60 rounded  font-sans font-semibold text-sm m-3 h-20"
          ></div>
        ))}
      </section>
      <section className="w-full flex flex-col">
        <div className="w-full flex flex-row gap-5 laptop:flex-row desktop:flex-row tablet:flex-col phone:flex-col">
          <div className="w-full bg-gray-200  h-96"></div>
          <div className="w-full flex flex-col gap-5">
            <div className=" bg-gray-200  h-1/3"></div>
            <div className=" bg-gray-200  h-2/3"></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardLoader;
