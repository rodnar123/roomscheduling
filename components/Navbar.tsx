"use client"; // Ensure this is a client-side component

import { useState } from "react";
import { FaHome, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa"; // Import icons
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"; // Clerk components

const Navbar = () => {
  const { isSignedIn } = useUser(); // Get the authentication status
  const [isSignInModalOpen, setSignInModalOpen] = useState(false); // Track the Sign-In modal state
  const [isMenuOpen, setMenuOpen] = useState(false); // Track the state of the mobile menu

  return (
    <nav className="bg-slate-900 text-white fixed top-0 w-full h-16 flex justify-between items-center px-6 shadow-md z-10">
      {/* Left Side - Home Icon */}
      <div className="flex items-center space-x-4">
        <Link className="text-xl hover:text-gray-200" href="/">
          <FaHome />
        </Link>
      </div>

      {/* Right Side - Menu Icon for Mobile */}
      <div className="flex items-center space-x-4 md:hidden">
        <button onClick={() => setMenuOpen(!isMenuOpen)} className="text-xl">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Right Side - Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        {!isSignedIn ? (
          <>
            {/* Trigger Clerk Sign-In modal */}
            <button onClick={() => setSignInModalOpen(true)}>
              <SignInButton mode="modal">
                <FaSignInAlt />
              </SignInButton>
            </button>
          </>
        ) : (
          /* Show User Button after successful sign-in */
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8", // Customize the user button size
              },
            }}
            afterSignOutUrl="/" // Optional: redirect after sign out
          />
        )}
      </div>

      {/* Mobile Menu - Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-slate-900 text-white flex flex-col items-center space-y-4 py-4 md:hidden">
          {/* Home Link */}
          <Link href="/" className="text-xl hover:text-gray-200">
            <FaHome /> Home
          </Link>

          {/* Sign-In or User Button */}
          {!isSignedIn ? (
            <>
              {/* Trigger Clerk Sign-In modal */}
              <button
                onClick={() => setSignInModalOpen(true)}
                className="text-xl"
              >
                <SignInButton mode="modal">
                  <FaSignInAlt /> Sign In
                </SignInButton>
              </button>
            </>
          ) : (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8", // Customize the user button size
                },
              }}
              afterSignOutUrl="/" // Optional: redirect after sign out
            />
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
