import Navbar from "@/app/dashboard/components/Navbar";
import Sidebar from "@/app/dashboard/components/Sidebar";
import DashboardProtectedRoutes from "@/components/HOC/DashboardProtectedRoutes";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardProtectedRoutes>
      <div className="flex w-full h-screen bg-secondary overflow-hidden">
        {/* Sidebar for larger screens */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-auto px-4 py-4">
            {children}
          </main>
        </div>
      </div>
    </DashboardProtectedRoutes>
  );
};

export default DashboardLayout;
