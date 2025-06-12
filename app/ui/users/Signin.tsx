"use client";
import React, { useState, useActionState, useEffect } from "react";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
import { FaUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { BiSolidLogInCircle } from "react-icons/bi";
import { signin } from "@/app/actions/loginAuth";
import { LoadingSpinner } from "@/app/component/Loaders/Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Signin = () => {
  const [state, action, pending] = useActionState(signin, undefined);
  const router = useRouter();

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    if (state?.response?.success) {
      timeOut = setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }

    return () => clearTimeout(timeOut);
  });

  return (
    <div className="w-full flex items-center justify-center desktop:bg-gray-50 laptop:bg-gray-50  phone:bg-transparent">
      <div className="bg-white shadow-sm rounded-md w-full max-w-md">
        {/* Header Section */}
        <div className="bg-white shadow-md px-5 py-5 flex justify-between items-center rounded-t-md phone:mx-5 desktop:mx-0 laptop:mx-0">
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
          {!state?.response?.success && state?.response?.message}
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
            <div className="w-full flex items-center justify-end">
              <Link href="/forgot-password" className="text-gray-600 text-end font-semibold">
                Forgot Password
              </Link>
            </div>
            <div className="w-full mt-4 flex justify-center">
              <button
                type="submit"
                disabled={pending}
                className={`btn disabled:bg-gray-300 text-base py-1 w-full flex items-center justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
              >
                {pending && <LoadingSpinner />}
                {!pending && (
                  <>
                    <BiSolidLogInCircle className="icon-move-left" />
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
