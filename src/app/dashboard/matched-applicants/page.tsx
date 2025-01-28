import { Metadata } from "next";
import AllAppliedCandidates from "./AllAppliedCandidates";
import Title from "@/components/Title";
// import DashboardLayout from "../layout";

export const metadata: Metadata = {
  title: "All Matched Seekers",
  description: "Asia JobsSwipe Admin Panel - All Companies",
};

const Alljobs = () => {
  return (
    // <DashboardLayout>

<Title
      title="Matched Seekers"
      className="w-full min-h-screen flex flex-col bg-background p-4"
    >
      <AllAppliedCandidates />
    </Title>
    // </DashboardLayout>
   
  );
};

export default Alljobs;
