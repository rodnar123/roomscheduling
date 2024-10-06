"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Course, Room } from "@prisma/client";
import { useState, useEffect } from "react";
import ScheduleQRCode from "@/components/ScheduleQRCode";

interface Schedule {
  id: number;
  courseId: number;
  course: { name: string };
  roomId: number;
  room: { name: string };
  date: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrence: string | null;
}

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [courseId, setCourseId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false); // Recurring checkbox
  const [recurrence, setRecurrence] = useState("WEEKLY"); // Default to WEEKLY
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    fetchSchedules();
    fetchCourses();
    fetchRooms();
  }, []);

  const fetchSchedules = async () => {
    const res = await fetch("/api/schedules");

    if (!res.ok) {
      console.log("Failed to fetch schedules");
      return;
    }

    const data = await res.json();
    setSchedules(data);
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data);
  };

  const fetchRooms = async () => {
    const res = await fetch("/api/rooms");
    const data = await res.json();
    setRooms(data);
  };

  const handleCreateSchedule = async () => {
    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: parseInt(courseId),
        roomId: parseInt(roomId),
        date,
        startTime,
        endTime,
        isRecurring: isRecurring,
        recurrence: isRecurring ? recurrence : null, // Only include recurrence if recurring
      }),
    });

    if (res.ok) {
      fetchSchedules();
      setCourseId("");
      setRoomId("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setIsRecurring(false);
      setRecurrence("WEEKLY");
    } else {
      const { error } = await res.json();
      alert(error); // Show error message for conflicts
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    await fetch(`/api/schedules/${id}`, { method: "DELETE" });
    fetchSchedules();
  };

  const handleEditSchedule = async () => {
    if (!editingSchedule) {
      console.error("No schedule to edit");
      return;
    }
    const res = await fetch(`/api/schedules/${editingSchedule.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: parseInt(courseId),
        roomId: parseInt(roomId),
        date,
        startTime,
        endTime,
        isRecurring,
        recurrence: isRecurring ? recurrence : null,
      }),
    });

    if (res.ok) {
      fetchSchedules();
      setCourseId("");
      setRoomId("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setIsRecurring(false);
      setRecurrence("WEEKLY");
      setEditingSchedule(null);
    } else {
      const { error } = await res.json();
      alert(error); // Show error message for conflicts
    }
  };

  const startEditing = (schedule: Schedule) => {
    setCourseId(schedule.courseId.toString());
    setRoomId(schedule.roomId.toString());
    setDate(schedule.date.split("T")[0]); // Format date for input
    setStartTime(schedule.startTime);
    setEndTime(schedule.endTime);
    setIsRecurring(schedule.isRecurring);
    setRecurrence(schedule.recurrence || "WEEKLY");
    setEditingSchedule(schedule);
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-6">Manage Schedules</h1>

      {/* Schedule Form */}
      <div className="mb-8">
        <select
          className="border p-2 mr-2"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 mr-2"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 mr-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="time"
          className="border p-2 mr-2"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          className="border p-2 mr-2"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <label className="mr-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="mr-1"
          />
          Recurring
        </label>

        {isRecurring && (
          <select
            className="border p-2 mr-2"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        )}

        {editingSchedule ? (
          <button
            className="bg-yellow-500 text-white px-4 py-2"
            onClick={handleEditSchedule}
          >
            Update Schedule
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleCreateSchedule}
          >
            Add Schedule
          </button>
        )}
      </div>

      {/* List of Schedules */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Course</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
            <th className="border p-2">Recurring</th>
            <th className="border p-2">Actions</th>
            <th className="border p-2">QR Code</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="border p-2">{schedule.course.name}</td>
              <td className="border p-2">{schedule.room.name}</td>
              <td className="border p-2">
                {new Date(schedule.date).toLocaleDateString()}
              </td>
              <td className="border p-2">{schedule.startTime}</td>
              <td className="border p-2">{schedule.endTime}</td>
              <td className="border p-2">
                {schedule.isRecurring ? schedule.recurrence : "No"}
              </td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 mr-2"
                  onClick={() => startEditing(schedule)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1"
                  onClick={() => handleDeleteSchedule(schedule.id)}
                >
                  Delete
                </button>
              </td>
              <td className="border p-2">
                <ScheduleQRCode scheduleId={schedule.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default SchedulesPage;
