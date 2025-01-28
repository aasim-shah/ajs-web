"use client";

import { useState, useEffect } from "react";
import useFetchJobs from "@/hooks/useFetchJobs";
const API_URL = process.env.NEXT_PUBLIC_API_URL   || 'https://ajs-server.hostdonor.com/api/v1';
    
import { useJobsData } from "@/context/jobsData";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaginationComponent from "@/components/Pagination";
import MenuTab from "@/components/MenuTabsApplicationProfile";
import Title from "@/components/Title";
import ApplicantProfile from "./applicantprofile/ApplicantProfile";
import Message from "./messages/Message";
import Resume from "./resume/Resume";
import ApplicantName from "./ApplicantName";
import DashboardLayout from "@/app/dashboard/layout";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL   || 'https://ajs-server.hostdonor.com/api/v1';
const AllJobsData = () => {
  const { page, pagination, changePage } = useJobsData();
  const [activeTab, setActiveTab] = useState("applicant-profile"); // Default to first tab

  const tabMenu = ["applicant-profile", "resume", "message"];

  const endpoint =
    activeTab === "active" ? "jobs" : "job-applications/all-job-applications";
  const api = `${baseUrl}/${endpoint}?page=${page}`;

  const { data, loading, error } = useFetchJobs(api);

  if (loading) return <LoadingSkeleton />;
  // if (error) return <div>Error: {error.message}</div>;

  const title = `Home - ${
    activeTab === "applicant-profile"
      ? "Applicant Profile"
      : activeTab === "resume"
      ? "Resume"
      : activeTab === "message"
      ? "Message"
      : ""
  }`;

  return (
    <DashboardLayout>
      <Title title={title}>
        <div className="flex gap-5">
          <div className="w-2/3 p-3 bg-background">
            <MenuTab activeTab={activeTab} changeTab={setActiveTab} tabMenu={tabMenu} />
            <main className="my-4 px-4 flex-1">
              {activeTab === "applicant-profile" && <ApplicantProfile />}
              {activeTab === "resume" && <Resume />}
              {activeTab === "message" && <Message />}
            </main>
          </div>

          <div className="w-1/3 bg-background">
            <ApplicantName />
          </div>
        </div>
      </Title>
    </DashboardLayout>
  );
};

export default AllJobsData;
