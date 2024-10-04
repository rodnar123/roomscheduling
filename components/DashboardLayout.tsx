// components/DashboardLayout.tsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex overflow-y-auto">
      {/* Navbar (Fixed) */}
      <Navbar />

      {/* Sidebar (Fixed) */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 mt-16 p-6 w-full bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
