// /api/schools/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const schools = await prisma.school.findMany({
        include: { faculties: true }, // Include related faculties
      });
      res.status(200).json(schools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({ error: 'Failed to fetch schools' });
    }
  } else if (req.method === 'POST') {
    const { name, facultyId } = req.body; // Expecting facultyId to link the school to a faculty

    console.log('Request Body:', req.body); // Log the request body for debugging

    // Check if facultyId is provided
    if (!facultyId) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ error: 'School name is required' });
    }

    try {
      const newSchool = await prisma.school.create({
        data: {
          name,
          facultyId: Number(facultyId), // Use facultyId directly here
        },
      });
      res.status(201).json(newSchool);
    } catch (error) {
      console.error('Error creating school:', error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to create school', details: error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
