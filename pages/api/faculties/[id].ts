import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const faculty = await prisma.faculty.findUnique({
        where: { id: Number(id) },
        include: { schools: true }, // Include related schools
      });
      if (faculty) {
        res.status(200).json(faculty);
      } else {
        res.status(404).json({ error: 'Faculty not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch faculty' });
    }
  } else if (req.method === 'PUT') {
    const { name } = req.body;
    try {
      const updatedFaculty = await prisma.faculty.update({
        where: { id: Number(id) },
        data: { name },
      });
      res.status(200).json(updatedFaculty);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update faculty' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.faculty.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete faculty' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
