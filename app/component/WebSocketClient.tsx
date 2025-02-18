"use client"

import { useEffect } from "react";
import { io } from "socket.io-client";

interface WebSocketProps {
    onMessage: (message: any) => void;
  }
  
   const useWebSocketClient: React.FC<WebSocketProps> = ({ onMessage }) => {
    useEffect(() => {
      const socket = io("http://localhost:4000");
  
      socket.on("connect", () => {
        console.log("Connected to the WebSocket server");
      });
  
      socket.on("message", onMessage);
  
      return () => {
        socket.disconnect(); // Clean up on unmount
      };
    }, [onMessage]);
  
    return null; // This component does not render anything
  };
  
  export default useWebSocketClient;