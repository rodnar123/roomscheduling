// pages/api/schedules/index.ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Utility functions
const padTime = (time: string) => time.toString().padStart(2, '0');

const isValidTimeFormat = (time: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  const formattedMinutes = padTime(minutes.toString());
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const schedules = await prisma.schedule.findMany({
        include: {
          course: true,
          room: true,
        },
      });

      // Format startTime and endTime
      const formattedSchedules = schedules.map(schedule => ({
        ...schedule,
        startTime: formatTime(schedule.startTime),
        endTime: formatTime(schedule.endTime),
      }));

      res.status(200).json(formattedSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ error: 'Failed to fetch schedules' });
    }
  } else if (req.method === 'POST') {
    const { courseId, roomId, date, startTime, endTime, isRecurring, recurrence } = req.body;

    // Validate input
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ error: "Date and times must be provided." });
    }
    
    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      return res.status(400).json({ error: "Invalid start or end time format." });
    }

    const formattedStartTime = `${padTime(startTime.split(':')[0])}:${padTime(startTime.split(':')[1])}:00`;
    const formattedEndTime = `${padTime(endTime.split(':')[0])}:${padTime(endTime.split(':')[1])}:00`;

    const parsedStartTime = new Date(`${date}T${formattedStartTime}`);
    const parsedEndTime = new Date(`${date}T${formattedEndTime}`);

    // Check if date conversion is valid
    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
      return res.status(400).json({ error: "Invalid start or end time format" });
    }

    try {
      // Find the course to get the teacherId for the conflict check
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
        include: { teachers: true },
      });

      if (!course) {
        return res.status(400).json({ error: 'Invalid course ID.' });
      }

      const teacherId = course.teachers.id;

      // 1. Check for teacher conflict
      const teacherConflict = await prisma.schedule.findFirst({
        where: {
          course: { teacherId: teacherId },
          date: new Date(date),
          OR: [
            { startTime: { lte: parsedEndTime }, endTime: { gte: parsedStartTime } }  // Overlapping time
          ],
        },
      });

      if (teacherConflict) {
        return res.status(400).json({
          error: 'Teacher is already assigned to another course at this time.',
        });
      }

      // 2. Check for room conflict
      const roomConflict = await prisma.schedule.findFirst({
        where: {
          roomId: Number(roomId),
          date: new Date(date),
          OR: [
            { startTime: { lte: parsedEndTime }, endTime: { gte: parsedStartTime } }  // Overlapping time
          ],
        },
      });

      if (roomConflict) {
        return res.status(400).json({
          error: 'Room is already booked for another course at this time.',
        });
      }

      // 3. Check for course conflict
      const courseConflict = await prisma.schedule.findFirst({
        where: {
          courseId: Number(courseId),
          date: new Date(date),
          OR: [
            { startTime: { lte: parsedEndTime }, endTime: { gte: parsedStartTime } }  // Overlapping time
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
          startTime: parsedStartTime,
          endTime: parsedEndTime,
          isRecurring: Boolean(isRecurring),
          recurrence: recurrence || null,
        },
      });

      res.status(201).json({
        ...newSchedule,
        startTime: formatTime(newSchedule.startTime),
        endTime: formatTime(newSchedule.endTime),
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
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

      // Validate input
      if (!date || !startTime || !endTime) {
        return res.status(400).json({ error: "Date and times must be provided." });
      }

      if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
        return res.status(400).json({ error: "Invalid start or end time format." });
      }

      const formattedStartTime = `${padTime(startTime.split(':')[0])}:${padTime(startTime.split(':')[1])}:00`;
      const formattedEndTime = `${padTime(endTime.split(':')[0])}:${padTime(endTime.split(':')[1])}:00`;

      const parsedStartTime = new Date(`${date}T${formattedStartTime}`);
      const parsedEndTime = new Date(`${date}T${formattedEndTime}`);

      // Check if date conversion is valid
      if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
        return res.status(400).json({ error: "Invalid start or end time format" });
      }

      // Find the course to get the teacherId for the conflict check
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
        include: { teachers: true },
      });

      if (!course) {
        return res.status(400).json({ error: 'Invalid course ID.' });
      }

      const teacherId = course.teachers.id;

      // 1. Check for teacher conflict (excluding the current schedule)
      const teacherConflict = await prisma.schedule.findFirst({
        where: {
          course: { teacherId: teacherId },
          date: new Date(date),
          OR: [
            { startTime: { lte: parsedEndTime }, endTime: { gte: parsedStartTime } }  // Overlapping time
          ],
          NOT: { id: Number(id) },
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
            { startTime: { lte: parsedEndTime }, endTime: { gte: parsedStartTime } }  // Overlapping time
          ],
          NOT: { id: Number(id) },
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
            { startTime: { lte: parsedEndTime }, endTime: { gte: parsedStartTime } }  // Overlapping time
          ],
          NOT: { id: Number(id) },
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
          startTime: parsedStartTime,
          endTime: parsedEndTime,
          isRecurring: Boolean(isRecurring),
          recurrence: recurrence || null,
        },
      });

      res.status(200).json({
        ...updatedSchedule,
        startTime: formatTime(updatedSchedule.startTime),
        endTime: formatTime(updatedSchedule.endTime),
      });
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const deletedSchedule = await prisma.schedule.delete({
        where: { id: Number(id) },
      });
      res.status(204).json(deletedSchedule);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      res.status(500).json({ error: 'Failed to delete schedule' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
