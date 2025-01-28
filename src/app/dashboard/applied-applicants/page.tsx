import { Metadata } from "next";
import AllAppliedCandidates from "./AllAppliedCandidates";
import Title from "@/components/Title";
// import DashboardLayout from "../dashboard/layout";
export const metadata: Metadata = {
  title: "All Matched Applicants",
  description: "Asia JobsSwipe Admin Panel - All Companies",
};

const AppliedApplicants = () => {
  return (
    // <DashboardLayout>
    <Title
      title="Matched Applicants"
      className="w-full min-h-screen flex flex-col bg-background p-4"
    >
      <AllAppliedCandidates />
    </Title>
    // </DashboardLayout>
  );
};

export default AppliedApplicants;
