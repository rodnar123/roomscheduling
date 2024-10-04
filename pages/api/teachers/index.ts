// pages/api/teachers/index.ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch all teachers
      const teachers = await prisma.teacher.findMany();
      res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch teachers' });
    }
  } else if (req.method === 'POST') {
    const { name, email } = req.body;

    try {
      // Check if the email is already used
      const existingTeacher = await prisma.teacher.findUnique({
        where: { email },
      });

      if (existingTeacher) {
        return res.status(400).json({ error: 'Email is already in use.' });
      }

      // Create a new teacher
      const newTeacher = await prisma.teacher.create({
        data: {
          name,
          email,
        },
      });
      res.status(201).json(newTeacher);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create teacher' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
