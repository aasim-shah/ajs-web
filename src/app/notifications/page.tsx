import { Metadata } from "next";
import Title from "@/components/Title";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Asia JobsSwipe Admin Panel - Notifications",
};
const NotificationsPage = () => {
  return <Title title="Notifications">All notifications</Title>;
};

export default NotificationsPage;
