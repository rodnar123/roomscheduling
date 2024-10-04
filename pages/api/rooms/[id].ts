// pages/api/rooms/[id].ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const room = await prisma.room.findUnique({
        where: { id: Number(id) },
      });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch room' });
    }
  } else if (req.method === 'PUT') {
    const { name, capacity, type } = req.body;
    try {
      const updatedRoom = await prisma.room.update({
        where: { id: Number(id) },
        data: {
          name,
          capacity,
          type,
        },
      });
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update room' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.room.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete room' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
