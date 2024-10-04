// pages/api/courses/index.ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch all courses with their related teacher and school
      const courses = await prisma.course.findMany({
        include: {
          teachers: true,  // Include teacher details
          school: true,   // Include school details
        },
      });
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  } else if (req.method === 'POST') {
    const { name, code, teacherId, schoolId } = req.body;

    try {
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

      // Create the course and link it to the teacher and school
      const newCourse = await prisma.course.create({
        data: {
          name,
          code,
          teacherId: Number(teacherId),
          schoolId: Number(schoolId),
        },
      });

      res.status(201).json(newCourse);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create course' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
