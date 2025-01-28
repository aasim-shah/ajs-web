"use client";

import { useState, useEffect } from "react";
import useFetchJobs from "@/hooks/useFetchJobs";
 
import { useJobsData } from "@/context/jobsData";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaginationComponent from "@/components/Pagination";
import MenuTab from "@/components/MenuTabsApplicationProfile";
import Title from "@/components/Title";
import PaymentPlan from "./paymentPlan/PaymentPlan";
import Message from "./messages/Message";
import Active from "./active/Active";
 
import DashboardLayout from "@/app/dashboard/layout";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL   || 'https://ajs-server.hostdonor.com/api/v1';
const AllJobsData = () => {
  const { page, pagination, changePage } = useJobsData();
  const [activeTab, setActiveTab] = useState("PaymentPlan"); // Default to first tab

  const tabMenu = ["PaymentPlan", "message" , "Active"];

  const endpoint =
    activeTab === "active" ? "jobs" : "job-applications/all-job-applications";
  const api = `${baseUrl}/${endpoint}?page=${page}`;

  const { data, loading, error } = useFetchJobs(api);

  if (loading) return <LoadingSkeleton />;
  // if (error) return <div>Error: {error.message}</div>;

  const title = `Home - ${
    activeTab === "PaymentPlan"
      ? "Message"
       : activeTab === "message"
      ? "Message"
      : activeTab === "Active"
      ? "Active"
     
      : ""
  }`;

  return (
    
      <Title title={title}>
        <div className="flex gap-5">
          <div className=" w-full p-3 bg-background md:text-2xl  sm:text-xl text-sm ">
            <MenuTab  activeTab={activeTab} changeTab={setActiveTab} tabMenu={tabMenu} />
           
          </div>
          </div>
          <div className="   ">

<main className="   flex-1">
    {activeTab === "PaymentPlan" && <PaymentPlan />}
    <div className="bg-background">
    {activeTab === "message" && <Message />}
    {activeTab === "Active" && <Active />}
    </div>
   
   
  </main>
</div>
         
       

       
      </Title>
   
  );
};

export default AllJobsData;
