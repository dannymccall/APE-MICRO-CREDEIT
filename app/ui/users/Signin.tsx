"use client";

import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import { FaUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { BiSolidLogInCircle } from "react-icons/bi";
import { signin } from "@/app/actions/loginAuth";
import { LoadingSpinner } from "@/app/component/Loading";
const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [state, action, pending] = useActionState(signin, undefined);
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   // Simulate form submission
  //   setTimeout(() => {
  //     setLoading(false);
  //     alert("Form Submitted!");
  //   }, 2000);
  // };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-md w-full max-w-md ">
        {/* Header Section */}
        <div className="bg-white shadow-xl px-5 py-5 flex justify-between items-center rounded-t-md">
          <div>
            <h1 className="text-lg text-violet-800 uppercase font-sans font-semibold">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500">
              Let's make today productive.
            </p>
          </div>
          <p className="text-sm font-bold font-sans">Sign in</p>
        </div>

        <p className="text-center my-2 text-red-600 font-semibold font-sans">
          {!state?.errors && state?.message}
        </p>

        {/* Form Section */}
        <div className="px-5 py-5">
          <form
            // onSubmit={handleSubmit}
            action={action}
            className="w-full flex flex-col gap-5 py-7"
          >
            {/* Username Field */}
            <div className="w-full my-3">
              <Label
                labelName="USERNAME"
                className="font-sans text-gray-500 text-sm"
              />
              <div className="flex flex-row items-center mt-2 border border-gray-200 rounded-md focus-within:border-violet-500">
                <div className="bg-violet-500 h-8 w-10 flex items-center justify-center rounded-l-md hover:bg-violet-200 transition">
                  <FaUserCircle className="text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  aria-label="Enter your username"
                  className="w-full h-8 text-sm px-2 rounded-r-md focus:outline-none focus:ring-0 font-sans transition ease-in-out delay-150"
                  name="username"
                />
              </div>
              {state?.errors?.username && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="w-full">
              <Label
                labelName="PASSWORD"
                className="font-sans text-gray-500 text-sm"
              />
              <div className="flex flex-row items-center mt-2 border border-gray-200 rounded-md focus-within:border-violet-500">
                <div className="bg-violet-500 h-8 w-10 flex items-center justify-center rounded-l-md hover:bg-violet-200 transition">
                  <FaLock className="text-white" />
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  aria-label="Enter your password"
                  className="w-full h-8 text-sm px-2 rounded-r-md focus:outline-none focus:ring-0 font-sans transition ease-in-out delay-150"
                  name="password"
                />
              </div>
              {state?.errors?.password && (
                <p className=" text-red-500 p-3 font-semibold">
                  {state.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full mt-4 flex justify-center">
              <button
                type="submit"
                disabled={pending}
                className={`w-full flex items-center justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
              >
                {pending && <LoadingSpinner />}
                {!pending && (
                  <>
                    <BiSolidLogInCircle />
                    SIGN IN
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
