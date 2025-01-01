"use client";

import styles from "./page.module.css";
import Signin from "@/app/ui/users/Signin";
import BackgroundImage from "@/public/microfinance.png";
import Image from "next/image";
import TextChange from "./component/TextChange";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen flex flex-row">
      <div className="min-h-screen w-full flex flex-row items-center justify-center align-middle  bg-gradient-to-r from-violet-600 to-violet-700 laptop:hidden desktop:block table:hidden">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Image src={BackgroundImage} alt="" />
          <TextChange className="text-2xl mt-10" />
        </div>
      </div>
      <Signin />
    </div>
  );
}
