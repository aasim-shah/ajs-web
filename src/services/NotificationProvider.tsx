// NotificationProvider.tsx
"use client"
import { ReactNode, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { toast } from "@/components/ui/use-toast";
import { socket } from "@/utils/constants";
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsSeen,
  getUnseenNotificationsCount,
} from "@/store/slices/notificationSlice";
import { Notification } from "@/store/slices/notificationSlice";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const dispatch: AppDispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notificationSlice.notifications);
  const unseenNotificationsCount = useSelector((state: RootState) => state.notificationSlice.unseenCount);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

  const fetchNotificationsData = useCallback(() => {
    if (token) {
      dispatch(fetchNotifications({ token }));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      dispatch(getUnseenNotificationsCount({ token }));
      fetchNotificationsData();
    }
  }, [fetchNotificationsData, dispatch, token]);

  const markUnseenNotificationAsSeen = async () => {
    try {
      if (token) {
        await dispatch(markAllNotificationsAsSeen({ token })).unwrap();
        toast({
          title: "Notifications",
          description: "All notifications marked as seen.",
        });
      }
    } catch (error) {
      // TypeScript needs to know that `error` is of type `any` or a specific type
      if (error instanceof Error) {
        console.error("Failed to mark notifications as seen:", error.message);
        toast({
          title: "Error",
          description: "Failed to mark notifications as seen.",
          variant: "destructive",
        });
      } else {
        console.error("Failed to mark notifications as seen:", error);
      }
    }
  };

  const handleMarkNotificationAsRead = useCallback(async (notificationId: string) => {
    if (!token) return;
    try {
      await dispatch(markNotificationAsRead({ id: notificationId, token })).unwrap();
      toast({
        title: "Notification",
        description: "Notification marked as read.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to mark notification as read:", error.message);
        toast({
          title: "Error",
          description: "Failed to mark notification as read.",
          variant: "destructive",
        });
      } else {
        console.error("Failed to mark notification as read:", error);
      }
    }
  }, [dispatch, token]);

  const handleDeleteNotification = useCallback(async (id: string) => {
    if (!token) return;
    try {
      await dispatch(deleteNotification({ id, token })).unwrap();
      toast({
        title: "Notification",
        description: "Notification deleted.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete notification:", error.message);
        toast({
          title: "Error",
          description: "Failed to delete notification.",
          variant: "destructive",
        });
      } else {
        console.error("Failed to delete notification:", error);
      }
    }
  }, [dispatch, token]);

  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      toast({
        title: "New notification",
        description: notification.description,
        variant: "default",
      });
      fetchNotificationsData();
    };

    if (socket) {
      socket.on("newNotification", handleNewNotification);
      return () => {
        socket.off("newNotification", handleNewNotification);
      };
    }
  }, [fetchNotificationsData]);

  return <>{children}</>;
};
