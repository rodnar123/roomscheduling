// pages/api/schools/[id].ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const school = await prisma.school.findUnique({
        where: { id: Number(id) },
        include: { faculties: true },
      });
      if (!school) {
        return res.status(404).json({ error: 'School not found' });
      }
      res.status(200).json(school);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch school' });
    }
  } else if (req.method === 'PUT') {
    const { name } = req.body;
    try {
      const updatedSchool = await prisma.school.update({
        where: { id: Number(id) },
        data: { name },
      });
      res.status(200).json(updatedSchool);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update school' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.school.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete school' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
