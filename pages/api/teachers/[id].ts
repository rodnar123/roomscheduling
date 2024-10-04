// pages/api/teachers/[id].ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetch the teacher by ID
      const teacher = await prisma.teacher.findUnique({
        where: { id: Number(id) },
      });

      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch teacher' });
    }
  } else if (req.method === 'PUT') {
    const { name, email } = req.body;

    try {
      // Fetch the teacher
      const teacher = await prisma.teacher.findUnique({
        where: { id: Number(id) },
      });

      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      // Update the teacher's details
      const updatedTeacher = await prisma.teacher.update({
        where: { id: Number(id) },
        data: {
          name,
          email,
        },
      });

      res.status(200).json(updatedTeacher);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update teacher' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete the teacher
      await prisma.teacher.delete({
        where: { id: Number(id) },
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete teacher' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
