"use client";
// components/SyncUser.tsx
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk hook to get logged-in user

const SyncUser = () => {
  const { isLoaded, user } = useUser(); // Get Clerk user

  useEffect(() => {
    if (isLoaded && user) {
      // Trigger API to sync the user with Prisma, but only after user data is fully loaded
      fetch("/api/sync-user", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User synced:", data);
        })
        .catch((err) => console.error("Error syncing user:", err));
    }
  }, [isLoaded, user]); // Run this only when the user data is loaded

  return null; // This component doesn't render anything visually
};

export default SyncUser;
