import { Metadata } from "next";
import AllAppliedCandidates from "./AllAppliedCandidates";
import Title from "@/components/Title";
// import DashboardLayout from "../layout";

export const metadata: Metadata = {
  title: "All Companies",
  description: "Asia JobsSwipe Admin Panel - All Companies",
};

const CompanyDashboard = () => {
  return (
    //  <DashboardLayout>
    <Title
      title="Home"
      className="w-full  h-screen flex flex-col bg-background p-4"
    >
      <AllAppliedCandidates />
    </Title>
    //  </DashboardLayout>
  );
};

export default CompanyDashboard;
