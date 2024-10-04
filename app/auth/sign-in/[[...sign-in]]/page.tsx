import Navbar from "@/components/Navbar";
import NavbarSignIn from "@/components/NavbarSignIn";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex flex-col mt-5 items-center space-x-4">
      <NavbarSignIn />
      <div className="mt-5 p-6">
        <SignIn />
      </div>
    </div>
  );
};

export default SignInPage;
