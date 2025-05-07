"use client";

import styles from "./page.module.css";
import Signin from "@/app/ui/users/Signin";
import BackgroundImage from "@/public/loan_background.jpeg";
import Image from "next/image";
import TextChange from "./component/TextChange";

export default function Home() {
  return (
    <div className="min-h-screen relative min-w-screen flex flex-row">
      <div className="min-h-screen w-full relative flex flex-row items-center justify-center align-middle  bg-gradient-to-r from-violet-600 to-violet-700 laptop:hidden desktop:block table:hidden phone:hidden">
        <div className="h-full w-full relative flex flex-col items-center justify-center bg-[url('../public/checkout.jpg')] bg-cover bg-center">
         <h1 className="text-slate-50 text-4xl font-mono">APE CREDIT</h1>
          <TextChange className="text-2xl mt-32 text-violet-800" />
        </div>
      </div>
      <Signin />
    </div>
  );
}
