import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface ILogginIdentity {
  fullName: string;
  userRoles: string[];
  userName: string;
}
export const useSocket = (logginIdentity: ILogginIdentity) => {
  const [message, setMessage] = useState<string>("");
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const clearToast = () => {
    let timeOut: NodeJS.Timeout;
    timeOut = setTimeout(() => {
      setMessage("");
      setShowNotification(false);
    }, 5000);

    return () => clearTimeout(timeOut);
  };
  useEffect(() => {
    if (!logginIdentity) return; // Ensure logginIdentity exists before running

    const socket = io(SOCKET_URL);

    const userRoles: string[] = logginIdentity.userRoles || [];
    // console.log(userRoles)

    switch (true) {
      case userRoles.includes("Admin"):
        socket.on("notifyAdmin", (msg) => {
          setMessage(msg);
          setShowNotification(true);
          clearToast();
        });

        // socket.on("loanApproved", (msg) => {
        //   setMessage(msg);
        //   setShowNotification(true);
        //   clearToast()
        // });

        break;

      case userRoles.includes("Loan officer"):
        console.log("connecting...");
        socket.on("connect", () => {
          console.log("Connected to WebSocket server");
          socket.emit("join", logginIdentity.userName);
        });

        socket.on("notifyLoanofficer", (msg) => {
          setMessage(msg);
          setShowNotification(true);
          clearToast();
        });

        socket.on("loanApproved", (msg) => {
          setMessage(msg);
          setShowNotification(true);
          clearToast();
        });
        break;

      default:
        console.warn("No matching role for WebSocket events.");
    }

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, [logginIdentity]); // Only run when logginIdentity changes

  return { message, showNotification };
};