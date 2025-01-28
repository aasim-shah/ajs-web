"use client";
import { useEffect, useState } from "react";
import { useCommonData } from "@/context/commonData";
import { createSocket, socket } from "@/utils/constants";
export default function Socket() {

  console.log("socketttt" , socket)
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAccessToken = localStorage.getItem("accessToken");
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
    }
  }, []);
 
  useEffect(() => {

    if (accessToken && !socket) {
      
      console.log("Creating socket connection..."); 
      createSocket(accessToken).connect();

      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
      });
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      socket.on("connect_error", (error: any) => {
        console.error("Connection error:", error);
      });

      return () => {
        if (socket) {
          socket.off("connect");
          socket.off("disconnect");
          socket.off("connect_error");
        }
      };
    }
  }, [socket, accessToken]);

  return null;
}