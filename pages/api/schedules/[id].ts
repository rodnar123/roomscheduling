// pages/api/schedules/[id].ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const schedule = await prisma.schedule.findUnique({
        where: { id: Number(id) },
        include: {
          course: true,
          room: true,
        },
      });
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  } 
  
  else if (req.method === 'PUT') {
    const { courseId, roomId, date, startTime, endTime, isRecurring, recurrence } = req.body;

    try {
      // Ensure no room or course conflicts
      const existingRoomSchedule = await prisma.schedule.findFirst({
        where: {
          roomId: Number(roomId),
          date: new Date(date),
          OR: [
            { startTime: { lte: new Date(endTime) }, endTime: { gte: new Date(startTime) } } // Overlapping time check
          ],
          NOT: { id: Number(id) }, // Exclude current schedule
        },
      });

      const existingCourseSchedule = await prisma.schedule.findFirst({
        where: {
          courseId: Number(courseId),
          date: new Date(date),
          OR: [
            { startTime: { lte: new Date(endTime) }, endTime: { gte: new Date(startTime) } } // Overlapping time check
          ],
          NOT: { id: Number(id) }, // Exclude current schedule
        },
      });

      if (existingRoomSchedule) {
        return res
          .status(400)
          .json({ error: 'Room is already booked at this date and time.' });
      }

      if (existingCourseSchedule) {
        return res
          .status(400)
          .json({ error: 'Course is already scheduled at this time.' });
      }

      // Update schedule
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
      console.error('Failed to update schedule:', error);
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  } 
  
  else if (req.method === 'DELETE') {
    try {
      await prisma.schedule.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      res.status(500).json({ error: 'Failed to delete schedule' });
    }
  } 
  
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
