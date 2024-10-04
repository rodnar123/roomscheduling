import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import NavbarSignIn from "@/components/NavbarSignIn";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col mt-5 items-center space-x-4">
      <NavbarSignIn />
      <div className="mt-5 p-6">
        <SignUp />
      </div>
    </div>
  );
}
