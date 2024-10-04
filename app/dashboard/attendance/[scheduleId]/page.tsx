"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk hook to get the logged-in user
import Navbar from "@/components/Navbar";

const AttendancePage = () => {
  const { user, isLoaded, isSignedIn } = useUser(); // Clerk provides `isLoaded` to check if user data is ready
  const scheduleId = useParams()?.scheduleId; // Capture the scheduleId from the route
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (scheduleId && user && isLoaded && isSignedIn) {
      // Ensure both scheduleId, user, and the user data are fully loaded before marking attendance
      markAttendance();
    }
  }, [scheduleId, user, isLoaded, isSignedIn]);

  const markAttendance = async () => {
    if (user) {
      try {
        console.log("Sending userId and scheduleId:", user.id, scheduleId); // Log the IDs
        const res = await fetch(`/api/attendance/${scheduleId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }), // Send the actual logged-in user's id
        });

        const data = await res.json();
        if (res.ok) {
          setMessage("Attendance marked successfully");
        } else {
          console.error("API Error:", data.error);
          setMessage(data.error || "Failed to mark attendance");
        }
      } catch (error) {
        console.error("Error in marking attendance:", error);
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4 md:px-0">
      <Navbar />
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-md text-center">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-blue-600">
          Attendance Status
        </h1>

        {/* Display different styles for success and error messages */}
        {message ? (
          <p
            className={`text-md md:text-lg font-medium ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        ) : (
          <p className="text-gray-500 text-md md:text-lg">
            Marking attendance...
          </p>
        )}

        {/* Optional: Add a loading spinner if the request is in progress */}
        {!message && (
          <div className="flex justify-center mt-6">
            <svg
              className="animate-spin h-5 w-5 md:h-6 md:w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
