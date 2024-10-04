import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server"; // Clerk helper to get authenticated user

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { scheduleId } = req.query;  // Get scheduleId from URL

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId: clerkUserId } = getAuth(req); // Get Clerk userId from the request
  if (!clerkUserId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Find or create the Prisma User based on Clerk's userId
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    // If user doesn't exist in Prisma, create it using Clerk's user data
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_API_KEY}` },
    }).then(res => res.json());

    user = await prisma.user.create({
      data: {
        clerkUserId,
        email: clerkUser.email_addresses[0].email_address, // Get email from Clerk
        name: clerkUser.first_name || "Unknown", // Get name from Clerk
      },
    });
    
  }


  try {
    // Check if attendance is already marked for the user
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,   // Use Prisma userId here
        scheduleId: Number(scheduleId),
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ error: "Attendance already marked" });
    }

    // Mark attendance by creating a new record in the attendance table
    const newAttendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        scheduleId: Number(scheduleId),
      },
    });

    return res.status(201).json({
      message: "Attendance marked successfully",
      attendance: newAttendance,
    });

  } catch (error) {
    console.error("Error recording attendance:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while marking attendance.",
    });
  }
}
