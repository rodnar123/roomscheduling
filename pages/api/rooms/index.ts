// pages/api/rooms/index.ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const rooms = await prisma.room.findMany();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  } else if (req.method === 'POST') {
    const { name, capacity, type } = req.body;
    try {
      const newRoom = await prisma.room.create({
        data: {
          name,
          capacity,
          type,
        },
      });
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create room' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
