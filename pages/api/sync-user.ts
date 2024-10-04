// pages/api/sync-user.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server"; // Clerk's auth method

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId: clerkUserId } = getAuth(req); // Clerk's userId

  if (!clerkUserId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Fetch user details from Clerk API
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    }).then(res => res.json());

    // Log the full Clerk user object for inspection
    console.log("Full Clerk User Object:", JSON.stringify(clerkUser, null, 2));

    // Check if the user already exists in Prisma
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      // Mapping Clerk API fields to Prisma fields
      const email = clerkUser.primary_email_address || clerkUser.email_addresses?.[0]?.email_address || "no-email@unknown.com";
      const name = clerkUser.first_name || clerkUser.full_name || clerkUser.username || "Unknown";

      // Create the user in Prisma if it doesn't exist
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email, // Clerk email goes to Prisma email
          name,  // Clerk first_name/full_name/username goes to Prisma name
        },
      });
    }

    return res.status(200).json({ message: "User synced", user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return res.status(500).json({ error: "Failed to sync user." });
  }
}
