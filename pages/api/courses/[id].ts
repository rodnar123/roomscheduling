// pages/api/courses/[id].ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetch the course by ID, including teacher and school details
      const course = await prisma.course.findUnique({
        where: { id: Number(id) },
        include: {
          teachers: true,
          school: true,
        },
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  } else if (req.method === 'PUT') {
    const { name, code, teacherId, schoolId } = req.body;

    try {
      // Validate that the course exists
      const course = await prisma.course.findUnique({
        where: { id: Number(id) },
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Validate that the teacher exists
      const teacher = await prisma.teacher.findUnique({
        where: { id: Number(teacherId) },
      });

      if (!teacher) {
        return res.status(400).json({ error: 'Invalid teacher ID.' });
      }

      // Validate that the school exists
      const school = await prisma.school.findUnique({
        where: { id: Number(schoolId) },
      });

      if (!school) {
        return res.status(400).json({ error: 'Invalid school ID.' });
      }

      // Update the course with new data
      const updatedCourse = await prisma.course.update({
        where: { id: Number(id) },
        data: {
          name,
          code,
          teacherId: Number(teacherId),
          schoolId: Number(schoolId),
        },
      });

      res.status(200).json(updatedCourse);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update course' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete the course by ID
      await prisma.course.delete({
        where: { id: Number(id) },
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete course' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
