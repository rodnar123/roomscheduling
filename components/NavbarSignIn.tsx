"use client"; // Ensure this is a client-side component

import { useState } from "react";
import { FaHome, FaSignInAlt } from "react-icons/fa"; // Import icons
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"; // Clerk components

const NavbarSignIn = () => {
  const { isSignedIn } = useUser(); // Get the authentication status
  const [isSignInModalOpen, setSignInModalOpen] = useState(false); // Track the Sign-In modal state

  return (
    <nav className="bg-slate-900 text-white fixed top-0 w-full h-16 flex justify-between items-center px-6 shadow-md z-10">
      {/* Left Side - Home Icon */}
      <div className="flex items-center space-x-4">
        <Link className="text-xl hover:text-gray-200" href="/">
          <FaHome />
        </Link>
      </div>
    </nav>
  );
};

export default NavbarSignIn;
