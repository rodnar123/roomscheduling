// pages/api/schedules/index.ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const schedules = await prisma.schedule.findMany({
        include: {
          course: true,
          room: true,
        },
      });
      res.status(200).json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error); // Log error
      res.status(500).json({ error: 'Failed to fetch schedules' });
    }
  } else if (req.method === 'POST') {
    const { courseId, roomId, date, startTime, endTime, isRecurring, recurrence } = req.body;

    try {
      // Find the course to get the teacherId for the conflict check
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
        include: { teachers: true }, // Get the teacher details
      });

      if (!course) {
        return res.status(400).json({ error: 'Invalid course ID.' });
      }

      const teacherId = course.teachers.id;

      // 1. Check for teacher conflict (for the same date, startTime, and endTime)
      const teacherConflict = await prisma.schedule.findFirst({
        where: {
          course: {
            teacherId: teacherId,
          },
          date: new Date(date),
          OR: [
            { startTime: { lte: new Date(endTime) }, endTime: { gte: new Date(startTime) } }  // Overlapping time
          ],
        },
      });

      if (teacherConflict) {
        return res.status(400).json({
          error: 'Teacher is already assigned to another course at this time.',
        });
      }

      // 2. Check for room conflict (for the same date, startTime, and endTime)
      const roomConflict = await prisma.schedule.findFirst({
        where: {
          roomId: Number(roomId),
          date: new Date(date),
          OR: [
            { startTime: { lte: new Date(endTime) }, endTime: { gte: new Date(startTime) } }  // Overlapping time
          ],
        },
      });

      if (roomConflict) {
        return res.status(400).json({
          error: 'Room is already booked for another course at this time.',
        });
      }

      // 3. Check for course conflict (whether this course is already scheduled in another room)
      const courseConflict = await prisma.schedule.findFirst({
        where: {
          courseId: Number(courseId),
          date: new Date(date),
          OR: [
            { startTime: { lte: new Date(endTime) }, endTime: { gte: new Date(startTime) } }  // Overlapping time
          ],
        },
      });

      if (courseConflict) {
        return res.status(400).json({
          error: 'This course is already scheduled at this time in another room.',
        });
      }

      // If no conflicts, create the schedule
      const newSchedule = await prisma.schedule.create({
        data: {
          courseId: Number(courseId),
          roomId: Number(roomId),
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          isRecurring: Boolean(isRecurring),
          recurrence: recurrence || null,  // Only add recurrence if it's provided
        },
      });

      res.status(201).json(newSchedule);
    } catch (error) {
      console.error('Error creating schedule:', error); // Log error
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { courseId, roomId, date, startTime, endTime, isRecurring, recurrence } = req.body;

    try {
      // Validate that the schedule exists
      const existingSchedule = await prisma.schedule.findUnique({
        where: { id: Number(id) },
      });

      if (!existingSchedule) {
        return res.status(404).json({ error: 'Schedule not found.' });
      }

      // Find the course to get the teacherId for the conflict check
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
        include: { teachers: true }, // Get the teacher details
      });

      if (!course) {
        return res.status(400).json({ error: 'Invalid course ID.' });
      }

      const teacherId = course.teachers.id;

      // 1. Check for teacher conflict (excluding the current schedule)
      const teacherConflict = await prisma.schedule.findFirst({
        where: {
          course: {
            teacherId: teacherId,
          },
          date: new Date(date),
          OR: [
            { startTime: { lte: new Date(endTime) }, endTime: { gte: new Date(startTime) } }  // Overlapping time
          ],
          NOT: { id: Number(id) },  // Exclude current schedule from conflict check
        },
      });

      if (teacherConflict) {
        return res.status(400).json({
          error: 'Teacher is already assigned to another course at this time.',
        });
      }

      // 2. Check for room conflict (excluding the current schedule)
      const roomConflict = await prisma.schedule.findFirst({
        where: {
          roomId: Number(roomId),
          date: new Date(date),
          OR: [
            { startTime: { lte: new Date(endTime) }, endTime: { gte: new Date(startTime) } }  // Overlapping time
          ],
          NOT: { id: Number(id) },  // Exclude current schedule from conflict check
        },
      });

      if (roomConflict) {
        return res.status(400).json({
          error: 'Room is already booked for another course at this time.',
        });
      }

      // 3. Check for course conflict (excluding the current schedule)
      const courseConflict = await prisma.schedule.findFirst({
        where: {
          courseId: Number(courseId),
          date: new Date(date),
          OR: [
            { startTime: { lte: new Date(endTime) }, endTime: { gte: new Date(startTime) } }  // Overlapping time
          ],
          NOT: { id: Number(id) },  // Exclude current schedule from conflict check
        },
      });

      if (courseConflict) {
        return res.status(400).json({
          error: 'This course is already scheduled at this time in another room.',
        });
      }

      // If no conflicts, update the schedule
      const updatedSchedule = await prisma.schedule.update({
        where: { id: Number(id) },
        data: {
          courseId: Number(courseId),
          roomId: Number(roomId),
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          isRecurring: Boolean(isRecurring),
          recurrence: recurrence || null,
        },
      });

      res.status(200).json(updatedSchedule);
    } catch (error) {
      console.error('Error updating schedule:', error); // Log error
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
