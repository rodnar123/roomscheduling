// pages/dashboard/index.tsx
import DashboardLayout from "../../components/DashboardLayout";

const DashboardHome = () => {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-gray-800">Main Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600">
        Welcome to the dashboard. Navigate using the sidebar.
      </p>
    </DashboardLayout>
  );
};

export default DashboardHome;
