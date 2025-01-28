import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchJobApplicationDetail, fetchMessages, sendMessage } from "@/store/slices/messageSlice";
import { GrAttachment } from "react-icons/gr";
import { FaSmile } from "react-icons/fa";
import { BiSolidRightArrow } from "react-icons/bi";
import Image from "next/image";
import axios from 'axios';
import MessageListener from "@/services/MessageListener";
import { Message } from "@/store/slices/messageSlice"; // Ensure this import matches the slice definition

const MessageList = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { messages = [], jobApplication } = useSelector((state: RootState) => state.messageSlice);
  const [newMessage, setNewMessage] = useState("");
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const companyId = typeof window !== "undefined" ? localStorage.getItem("_id") : null;
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (companyId) {
      axios.get(`https://ajs-server.hostdonor.com/api/v1/company/${companyId}`)
        .then(response => {
          setCompanyDetails(response.data.company);
          
        })
        .catch(error => {
          console.error("Error fetching company details:", error);
        });
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId && token) {
      const applicationId = Array.isArray(params.id) ? params.id[0] : params.id;
      dispatch(fetchJobApplicationDetail({ applicationId, token }) as any)
        .unwrap()
        .then((response: any) => {
          const jobSeekerId = response.jobSeeker?._id;
          if (jobSeekerId) {
            dispatch(fetchMessages({ receiverId: jobSeekerId, token }) as any)
              .unwrap()
              .then((fetchedMessages: Message[]) => {
               
                scrollToBottom();
              })
              .catch((err: unknown) => {
                console.error("Error fetching messages:", err);
              });
          } else {
            console.error("JobSeeker ID not found in response.");
          }
        })
        .catch((err: unknown) => {
          console.error("Error fetching job application details:", err);
        });
    }
  }, [dispatch, params.id, token, companyDetails]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (jobApplication && jobApplication.jobSeeker._id && newMessage.trim() && token) {
      const messageToSend = {
        receiverId: jobApplication.jobSeeker._id,
        message: newMessage,
        token,
      };

    
      dispatch(sendMessage(messageToSend) as any)
        .unwrap()
        .then(() => {
          setNewMessage("");
          if (inputRef.current) {
            inputRef.current.focus();
          }
          scrollToBottom();
        })
        .catch((err: unknown) => {
          console.error("Error sending message:", err);
        });
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isMessageForCurrentChat = (message: Message) => {
    if (!jobApplication || !companyDetails) return false;
    const jobSeekerId = jobApplication.jobSeeker._id;
    const companyUserId = companyDetails?.userInfo?._id;
    return (
      (message.sender === jobSeekerId && message.receiver === companyUserId) ||
      (message.sender === companyUserId && message.receiver === jobSeekerId)
    );
  };

  const filteredMessages = messages.filter(isMessageForCurrentChat);

  return (
    <div className="h-screen flex flex-col">
      <MessageListener />
      <div className="flex items-center p-4 bg-gray-100 border-b">
        {jobApplication ? (
          <>
            <Image
              src={jobApplication.jobSeeker.profilePicture || '/images/profilepics.png'}
              alt="Profile"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full mr-4"
              onError={(e) => e.currentTarget.src = '/images/placeholderimage.png'}
            />
            <div>
              <p className="font-semibold text-lg">{jobApplication.jobSeeker.firstName} {jobApplication.jobSeeker.lastName}</p>
              <p className="text-sm text-gray-500">Status: Online</p>
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full mr-4 bg-gray-300 dark:bg-gray-300"></div>
            <div>
              <p className="font-semibold text-lg">Loading...</p>
              <p className="text-sm text-gray-500">Please wait</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <ul>
          {companyDetails && filteredMessages.map((message) => (
            <li key={message._id} className={`mb-4 flex ${message.sender === companyDetails.userInfo._id ? 'justify-end' : 'justify-start'} max-w-full`}>
              <div className={`flex items-center ${message.sender === companyDetails.userInfo._id ? 'flex-row-reverse' : ''} max-w-full`}>
                <Image
                  src={message.sender === companyDetails.userInfo._id ? companyDetails.companyLogo : jobApplication?.jobSeeker.profilePicture || '/images/profilepics.png'}
                  alt="avatar"
                  width={40}
                  height={40}
                  className={`h-10 w-10 rounded-full ${message.sender === companyDetails.userInfo._id ? 'ml-2' : 'mr-2'}`}
                  onError={(e) => e.currentTarget.src = '/images/placeholderimage.png'}
                />
                <div className={`p-2 rounded-lg max-w-xs break-words ${message.sender === companyDetails.userInfo._id ? 'bg-signature text-background' : 'bg-gray-200 text-foreground'}`}>
                  <p>{message.message}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div ref={bottomRef} />
      </div> 

      <div className="sm:p-4 p-2 border-t">
        <div className="flex items-center border rounded-lg p-2 bg-background dark:bg-gray-800 space-x-2 max-w-full">
          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-background flex-shrink-0">
            <GrAttachment size={15} />
          </button>
          <input
            type="text"
            placeholder="Reply message"
            className="flex-grow p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none w-2/3 sm:max-w-full"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            ref={inputRef}
          />
          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-background flex-shrink-0">
            <FaSmile size={15} />
          </button>
          <button
            className="p-2 bg-blue text-background rounded-full hover:bg-blue-600 focus:outline-none flex-shrink-0"
            onClick={handleSendMessage}
          >
            <BiSolidRightArrow size={15} />
          </button>
        </div>
      </div>
    </div>
  ); 
};

export default MessageList;
