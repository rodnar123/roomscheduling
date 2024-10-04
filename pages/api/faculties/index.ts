import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const faculties = await prisma.faculty.findMany({
        include: { schools: true }, // Include related schools
      });
      res.status(200).json(faculties);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch faculties' });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;
    try {
      const newFaculty = await prisma.faculty.create({
        data: {
          name,
        },
      });
      res.status(201).json(newFaculty);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create faculty' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
