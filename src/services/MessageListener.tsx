"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { receiveMessage } from "@/store/slices/messageSlice";
import { socket } from "@/utils/constants";

const MessageListener = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Retrieve userId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        setUserId(userInfo._id);
      }
    }
  }, []);

  // Consolidated socket events handling
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    const handleMessage = (newMessage: any) => {
      // Add new message to the state
      setMessages((prevMessages: any[]) => [...prevMessages, newMessage]);

      // If the message is received by the current user, mark it as read and update state
      if (newMessage.receiver === userId) {
        socket.emit("messageRead", newMessage._id);
       
      }

      socket.on("messageReadStatusUpdated", ({ messageId }: any) => {
        setMessages((prevMessages: any) =>
          prevMessages.map((msg: any) =>
            msg._id === messageId ? { ...msg, read: true } : msg
          )
        );
      });

      // Dispatch message to Redux if the message involves the current user
      if (newMessage.receiver === userId || newMessage.sender === userId) {
        dispatch(receiveMessage(newMessage));
      }
    };

    // Listen for online users
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    // Set up socket listeners
    socket.on("newMessage", handleMessage);
    socket.on("getOnlineUsers", handleOnlineUsers);

    // Cleanup listeners on component unmount
    return () => {
      socket.off("newMessage", handleMessage);
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("messageReadStatusUpdated");
    };
  }, [dispatch, userId]);

  return null; // No UI rendering, just handling socket events
};

export default MessageListener;
