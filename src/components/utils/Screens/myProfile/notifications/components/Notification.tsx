import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearch } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { FaRegBellSlash } from "react-icons/fa6";
import { AppDispatch, RootState } from '@/store';
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '@/store/slices/notificationSlice';

const Notification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notificationSlice.notifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isProfilePicDialogOpen, setIsProfilePicDialogOpen] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications({ token }));
    }
  }, [dispatch, token]);

  const handleSelectMessage = (id: string) => {
    setSelectedMessage(id);
    if (token) {
      dispatch(markNotificationAsRead({ id, token }));
    }
  };

  const handleDeleteNotification = (id: string) => {
    if (token) {
      dispatch(deleteNotification({ id, token }));
    }
  };

  const filteredMessages = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="md:flex border rounded-[20px] h-screen">
      <div className="md:w-1/3 border-r px-4 py-4 md:pl-16 md:pr-10">
        <div className="relative mb-4 w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <IoSearch size={25} className="text-signininput3" />
          </div>
          <input
            type="text"
            placeholder="Search notifications"
            className="w-full text-signininput3 rounded border p-2 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className="overflow-y-auto h-[calc(100vh-60px)]">
          {filteredMessages.map((message) => (
            <li
              key={message._id}
              className={`mb-4 pb-4 border-b flex items-center cursor-pointer ${selectedMessage === message._id ? 'bg-gray-200' : ''}`}
              onClick={() => handleSelectMessage(message._id)}
            >
              <img src={message?.avatar} alt="avatar" className="mr-2 h-10 w-10 rounded-full cursor-pointer" onClick={() => setIsProfilePicDialogOpen(true)} />
              <div>
                <div className='flex justify-between'>
                  <div className='flex items-center'>
                    <p className="font-semibold text-base">{message.title}</p>
                    <BsDot color='blue' />
                  </div>
                  <div>
                    <span className=" text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-base text-gray-500">{message.description}</p>
              </div>
              <Dialog open={isProfilePicDialogOpen} onOpenChange={setIsProfilePicDialogOpen}>
                <DialogTrigger asChild>
                  <div></div>
                </DialogTrigger>
                <DialogContent className="p-6">
                  <img
                    src={message.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden md:flex md:w-2/3 flex-col h-full">
        {selectedMessage ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <Dialog open={isProfilePicDialogOpen} onOpenChange={setIsProfilePicDialogOpen}>
                  <DialogTrigger asChild>
                    <img
                      src={notifications.find((notification) => notification._id === selectedMessage)?.avatar}
                      alt="avatar"
                      className="h-10 w-10 rounded-full cursor-pointer"
                      onClick={() => setIsProfilePicDialogOpen(true)}
                    />
                  </DialogTrigger>
                  <DialogContent className="p-6">
                    <img
                      src={notifications.find((notification) => notification._id === selectedMessage)?.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
                <p className="font-semibold text-lg">{notifications.find((notification) => notification._id === selectedMessage)?.title}</p>
              </div>
              <Button variant="destructive" onClick={() => handleDeleteNotification(selectedMessage)}>Delete</Button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <p className="text-base text-gray-500">{notifications.find((notification) => notification._id === selectedMessage)?.description}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FaRegBellSlash className='text-signature opacity-40' size={200} />
            <p className="text-lg text-signature opacity-70">No Notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
