// "use client";
// import { useEffect, useState, useRef, Suspense } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/store";
// import {
//   fetchChats,
//   fetchMessages,
//   scheduleInterviewAction,
//   sendMessage,
// } from "@/store/slices/messageSlice";
// import { TbMessage2Off } from "react-icons/tb";
// import { IoVideocamOutline, IoCallOutline, IoSearch } from "react-icons/io5";
// import { BsDot } from "react-icons/bs";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import MessageListener from "@/services/MessageListener";
// import { Chat, User } from "@/store/slices/messageSlice"; // Import types
// import { useSearchParams } from "next/navigation"; // Import useSearchParams
// import { useToast } from "@/components/ui/use-toast";

// const getMessageUser = (
//   chatUsers: User[] | undefined,
//   userId: string
// ): User | undefined => {
//   return chatUsers?.find((user: User) => user._id === userId);
// };

// const MessageList = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const searchParams = useSearchParams(); // Initialize useSearchParams to access query params
//   const { chats, messages, status, error } = useSelector(
//     (state: RootState) => state.messageSlice
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedChat, setSelectedChat] = useState<string | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
//   const [isVideoCallDialogOpen, setIsVideoCallDialogOpen] = useState(false);
//   const [isProfilePicDialogOpen, setIsProfilePicDialogOpen] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   // Fetching the sender ID from localStorage
//   const accessToken =
//     typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
//   const userInfo =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("userInfo") || "{}")
//       : {};
//   const userId: string = userInfo._id;

//   // Extract the receiver's ID from the query parameters

//   const { toast } = useToast();

//   let chatUserId: string | null;
//   useEffect(() => {
//     if (accessToken) {
//       // Fetch chats when the component mounts
//       chatUserId = searchParams.get("chatUserId");
//       dispatch(fetchChats({ token: accessToken }));
//     } else {
//       console.error("Access token not found");
//     }
//   }, [dispatch, accessToken]);

//   useEffect(() => {
//     if (chatUserId && accessToken && chats.length > 0) {
//       // Find or initiate a chat with the receiver (applicant)
//       const chatWithUser = chats.find((chat: Chat) =>
//         chat.users.some((user: User) => user._id === chatUserId)
//       );

//       if (chatWithUser) {
//         setSelectedChat(chatWithUser._id); // Set the selected chat
//       } else {
//         // If no existing chat, initiate a new chat
//         setSelectedChat(null); // Clear selection
//       }
//     }
//   }, [chats, accessToken]);

//   useEffect(() => {
//     if (selectedChat && accessToken) {
//       const chat = chats.find((chat: Chat) => chat._id === selectedChat);
//       if (chat) {
//         const receiver = chat.users?.find(
//           (user: User) => user._id === chatUserId
//         );
//         if (receiver) {
//           // Fetch messages between the sender and receiver
//           dispatch(
//             fetchMessages({ receiverId: receiver._id, token: accessToken })
//           )
//             .unwrap()
//             .then(() => {
//               scrollToBottom();
//             })
//             .catch((err) => {
//               console.error("Error fetching messages:", err);
//             });
//         } else {
//           console.error("No receiver found in the chat.");
//         }
//       } else {
//         console.error("No chat found with the selectedChat ID.");
//       }
//     } else if (!accessToken) {
//       console.error("Access token not found");
//     }
//   }, [selectedChat, dispatch, accessToken, chats]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSelectChat = (id: string) => {
//     setSelectedChat(id);
//   };

//   const handleSendMessage = () => {
//     if (selectedChat && newMessage.trim() !== "" && accessToken) {
//       const chat = chats.find((chat: Chat) => chat._id === selectedChat);
//       const receiver = chat?.users?.find(
//         (user: User) => user._id !== chatUserId
//       );

//       if (!receiver) {
//         console.error("Receiver not found for the selected chat.");
//         return;
//       }

//       const messageToSend = {
//         receiverId: receiver._id,
//         message: newMessage,
//         token: accessToken,
//       };

//       dispatch(sendMessage(messageToSend))
//         .unwrap()
//         .then(() => {
//           setNewMessage("");
//           if (inputRef.current) {
//             inputRef.current.focus();
//           }
//           scrollToBottom();
//         })
//         .catch((err: any) => {
//           console.error("Error sending message:", err);
//         });
//     }
//   };

//   const scrollToBottom = () => {
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const getUserProfilePicture = (user: User | undefined) => {
//     if (!user) return "/images/profilepics.png";
//     const profilePicture =
//       user.profilePicture || user.companyLogo || "/images/profilepics.png";
//     return profilePicture;
//   };

//   const getUserName = (user: User | undefined) => {
//     if (!user) return "";
//     return user.firstName || user.companyName || "";
//   };

//   const filteredChats = (chats || []).filter((chat: Chat) =>
//     chat.users?.some(
//       (user: User) =>
//         user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const getReceiverId = () => {
//     const receiver = chats
//       .find((chat: Chat) => chat._id === selectedChat)
//       ?.users?.find((user: User) => user._id !== userId);
//     console.log({ receiver });
//     return receiver?._id;
//   };

//   // const scheduleInterview = () => {
//   //   // console.log({ });
//   //   const receiverId = getReceiverId();
//   //   console.log({ receiverId });
//   //   console.log({ accessToken });

//   //   if (accessToken) {
//   //     dispatch(scheduleInterviewAction({ id: receiverId, token: accessToken }));
//   //   } else {
//   //     console.error("Access token not found");
//   //   }
//   // };

//   const scheduleInterview = () => {
//     const receiverId = getReceiverId(); // Assuming this function gets the receiver's ID
//     const accessToken = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage

//     console.log({ receiverId });
//     console.log({ accessToken });

//     if (accessToken && receiverId) {
//       dispatch(scheduleInterviewAction({ id: receiverId, token: accessToken }))
//         .unwrap() // This will let you handle success or failure more easily
//         .then((result) => {
//           if (result.interviewScheduled) {
//             toast({
//               title: "Job Interview Scheduled",
//               description: "The job interview has been scheduled successfully.",
//               variant: "default",
//             });
//             console.log("Interview scheduled successfully:", result);
//           }
//         })
//         .catch((error) => {
//           console.error("Failed to schedule interview:", error);
//         });

//       setIsVideoCallDialogOpen(false);
//     } else {
//       console.error("Access token or receiver ID not found");
//     }
//   };

//   return (
//     <div className="md:flex border rounded-[20px] h-screen ">
//       {/* Including the MessageListener component */}
//       <MessageListener />
//       <div className="md:w-1/3 border-r px-4 py-4 md:pl-16 md:pr-10">
//         <div className="relative mb-4 w-full">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//             <IoSearch size={25} className="text-signininput3" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search messages"
//             className="w-full text-signininput3 rounded border p-2 pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <ul className="overflow-y-auto h-[calc(100vh-60px)]">
//           {status === "loading" ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <p className="text-lg text-signature opacity-70">
//                 Loading Chats...
//               </p>
//             </div>
//           ) : filteredChats.length > 0 ? (
//             filteredChats.map((chat: Chat) => {
//               const user = chat.users?.find(
//                 (user: User) => user._id !== userId
//               );
//               return (
//                 <li
//                   key={chat._id}
//                   className="mb-4 pb-4 border-b flex items-center cursor-pointer"
//                   onClick={() => handleSelectChat(chat._id)}
//                 >
//                   <Image
//                     src={getUserProfilePicture(user)}
//                     alt="avatar"
//                     className="mr-2 h-10 w-10 rounded-full"
//                     width={40}
//                     height={40}
//                     onError={(e) =>
//                       (e.currentTarget.src = "/images/placeholderimage.png")
//                     }
//                   />
//                   <div>
//                     <div className="flex justify-between">
//                       <div className="flex items-center">
//                         <p className="font-semibold text-base">
//                           {getUserName(user)} {user?.lastName}
//                         </p>
//                         <BsDot color="blue" />
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-500">
//                           {new Date(
//                             chat.latestMessage.createdAt
//                           ).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                     <p className="text-base text-gray-500">
//                       {chat.latestMessage.message}
//                     </p>
//                   </div>
//                 </li>
//               );
//             })
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full">
//               <TbMessage2Off className="text-signature opacity-40" size={200} />
//               <p className="text-lg text-signature opacity-70">No Messages</p>
//             </div>
//           )}
//         </ul>
//       </div>
//       <div className="hidden md:flex md:w-2/3 flex-col">
//         {selectedChat !== null ? (
//           <div className="flex flex-col h-full">
//             <div className="flex items-center justify-between p-4 border-b">
//               <div className="flex items-center gap-4">
//                 <Dialog
//                   open={isProfilePicDialogOpen}
//                   onOpenChange={setIsProfilePicDialogOpen}
//                 >
//                   <DialogTrigger asChild>
//                     <Image
//                       src={getUserProfilePicture(
//                         chats
//                           .find((chat: Chat) => chat._id === selectedChat)
//                           ?.users?.find((user: User) => user._id !== userId)
//                       )}
//                       alt="avatar"
//                       className="h-10 w-10 rounded-full cursor-pointer"
//                       width={40}
//                       height={40}
//                       onError={(e) =>
//                         (e.currentTarget.src = "/images/profilepics.png")
//                       }
//                     />
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Profile Picture</DialogTitle>
//                       <DialogDescription>
//                         <Image
//                           src={getUserProfilePicture(
//                             chats
//                               .find((chat: Chat) => chat._id === selectedChat)
//                               ?.users?.find((user: User) => user._id !== userId)
//                           )}
//                           alt="Profile Picture"
//                           layout="fill"
//                           width={500}
//                           height={500}
//                         />
//                       </DialogDescription>
//                     </DialogHeader>
//                     <DialogFooter>
//                       <Button
//                         variant="outline"
//                         onClick={() => setIsProfilePicDialogOpen(false)}
//                       >
//                         Close
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//                 <p className="font-semibold text-base">
//                   {getUserName(
//                     chats
//                       .find((chat: Chat) => chat._id === selectedChat)
//                       ?.users?.find((user: User) => user._id !== userId)
//                   )}{" "}
//                   {chats
//                     .find((chat: Chat) => chat._id === selectedChat)
//                     ?.users?.find((user: User) => user._id !== userId)
//                     ?.lastName || ""}
//                 </p>
//               </div>
//               <div>
//                 <Button
//                   variant="outline"
//                   className="mr-2"
//                   onClick={() => setIsVideoCallDialogOpen(true)}
//                 >
//                   <IoCallOutline />
//                 </Button>
//                 <Dialog
//                   open={isCallDialogOpen}
//                   onOpenChange={setIsCallDialogOpen}
//                 >
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Call</DialogTitle>
//                       <DialogDescription>
//                         <p>Are you sure you want to make a call?</p>
//                       </DialogDescription>
//                     </DialogHeader>
//                     <DialogFooter>
//                       <Button
//                         variant="outline"
//                         onClick={() => setIsCallDialogOpen(false)}
//                       >
//                         Close
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>

//                 <Button
//                   variant="outline"
//                   onClick={() => setIsVideoCallDialogOpen(true)}
//                 >
//                   <IoVideocamOutline />
//                 </Button>
//                 <Dialog
//                   open={isVideoCallDialogOpen}
//                   onOpenChange={setIsVideoCallDialogOpen}
//                 >
//                   <DialogContent className="p-4">
//                     <DialogHeader>
//                       <DialogTitle>Schedule Interview</DialogTitle>
//                       <DialogDescription>
//                         <p>Do you want to schedule an interview ?</p>
//                       </DialogDescription>
//                     </DialogHeader>
//                     <DialogFooter>
//                       <Button
//                         variant="outline"
//                         onClick={() => setIsVideoCallDialogOpen(false)}
//                       >
//                         Close
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="bg-[#0772FF] hover:bg-[#0772FF] hover:text-white text-white"
//                         onClick={scheduleInterview}
//                       >
//                         Schedule
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//               {status === "loading" ? (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <p className="text-lg text-signature opacity-70">
//                     Loading Messages...
//                   </p>
//                 </div>
//               ) : messages.length > 0 ? (
//                 <ul>
//                   {messages.map((msg) => {
//                     const isSender = msg.sender === userId;
//                     const chat = chats.find(
//                       (chat: Chat) => chat._id === selectedChat
//                     );
//                     const sender = getMessageUser(chat?.users, msg.sender);
//                     const receiver = getMessageUser(chat?.users, msg.receiver);

//                     // Use sender's information for all messages
//                     const displayUser = sender;

//                     return (
//                       <li
//                         key={msg._id}
//                         className={`mb-4 flex ${
//                           isSender ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`flex items-center ${
//                             isSender ? "flex-row-reverse" : ""
//                           }`}
//                         >
//                           <Image
//                             src={getUserProfilePicture(displayUser)}
//                             alt="avatar"
//                             width={40}
//                             height={40}
//                             className={`h-10 w-10 rounded-full ${
//                               isSender ? "ml-2" : "mr-2"
//                             }`}
//                             onError={(e) =>
//                               (e.currentTarget.src = "/images/profilepics.png")
//                             }
//                           />
//                           <div
//                             className={`p-2 rounded-lg ${
//                               isSender
//                                 ? "bg-signature text-background"
//                                 : "bg-gray-200 text-foreground"
//                             }`}
//                           >
//                             <p>{msg.message}</p>
//                             <span className="text-xs text-gray-500">
//                               {new Date(msg.createdAt).toLocaleTimeString()}
//                             </span>
//                           </div>
//                         </div>
//                       </li>
//                     );
//                   })}
//                   <div ref={bottomRef} />
//                 </ul>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <TbMessage2Off
//                     className="text-signature opacity-40"
//                     size={200}
//                   />
//                   <p className="text-lg text-signature opacity-70">
//                     No Messages
//                   </p>
//                 </div>
//               )}
//             </div>
//             {/* Moved the bottomRef div just above the input area */}
//             <div ref={bottomRef} />
//             <div className="p-4 border-t">
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   placeholder="Type a message"
//                   className="w-full text-signininput3 rounded border p-2"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   ref={inputRef}
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   className="ml-2 px-4 py-2 bg-blue text-background rounded"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-lg text-signature opacity-70">
//               Select a chat to view messages
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageList;

function MessageList() {
  return <div>page</div>;
}

export default MessageList;
