"use client";
import React from "react";
import Toast from "./toast/Toast";
import { useLogginIdentity, useSocket } from "../lib/customHooks";
import { FaCircleCheck } from "react-icons/fa6";
export default function Notifications() {
  const logginIdentity = useLogginIdentity();
  const { message, showNotification } = useSocket(logginIdentity);

  return (
    showNotification && message && (
      <Toast message={message} Icon={FaCircleCheck} title="" />
    )
  );
}
