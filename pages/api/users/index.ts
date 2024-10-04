// pages/api/users/index.ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    const { name, email, clerkUserId} = req.body;
    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          clerkUserId,

      
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
