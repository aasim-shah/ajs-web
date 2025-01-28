// pages/index.js
"use client";
import Tabs from "../../../repeatComponents/Tabs";
import AppliedJobs from "./applied_jobs";
import Profile from "./profile/Profile";
import Message from "./messages";
import Notification from "./notifications/components/Notification";
import Declined from "./declined_jobs";
import withProtectedRoutes from "@/components/HOC/ProtectedRoutes";

const IndexPage = () => {
  const tabs = [
    {
      title: 'My Profile',
      content: <div><Profile/></div>
    },
    {
      title: 'Applied Jobs',
      content: <div><AppliedJobs/></div>
    },
    {
      title: 'Messages',
      content: <div><Message/></div>
    },
    {
      title: 'Notifications',
      content: <div><Notification/></div>
    },
    {
      title: 'Declined Jobs',
      content: <div><Declined/></div>
    },
  ];

  return (
    <div className="md:container md:mx-auto mt-8">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default withProtectedRoutes(IndexPage);
