import { useEffect, useState } from "react";

import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { Course, Room, Schedule } from "@prisma/client";

interface Supervisor {
  id: string | number;
  name: string;

  roomId: string | number;
  day: string;
  startTime: string;
  endTime: string;

  courseId: string | number;
  supervisorId: string | number;
}

const ScheduleSupervisorPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [editingSuperviro, setEditingSupervisor] = useState<Supervisor | null>(
    null
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState<number | string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<number | string>("");
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<
    number | string
  >("");
  const [day, setDay] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const coursesData = await axios.get("/api/courses");
      const roomsData = await axios.get("/api/rooms");
      const supervisorsData = await axios.get("/api/supervisors");
      const schedulesData = await axios.get("/api/schedules");

      setCourses(coursesData.data);
      setRooms(roomsData.data);
      setSupervisors(supervisorsData.data);
      setSchedules(schedulesData.data);
    };

    fetchData();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError("");

    // Check for room duplication
    const hasRoomOverlap = schedules.some((schedule) => {
      return (
        schedule.roomId === selectedRoomId &&
        schedule.day === day &&
        ((startTime >= schedule.startTime && startTime < schedule.endTime) ||
          (endTime > schedule.startTime && endTime <= schedule.endTime))
      );
    });

    if (hasRoomOverlap) {
      setError("This room is already booked for the selected time.");
      return;
    }

    // Check for supervisor and course duplication
    const hasSupervisorDuplication = schedules.some((schedule) => {
      return (
        schedule.courseId === selectedCourseId &&
        schedule.supervisorId === selectedSupervisorId &&
        schedule.day === day &&
        ((startTime >= schedule.startTime && startTime < schedule.endTime) ||
          (endTime > schedule.startTime && endTime <= schedule.endTime))
      );
    });

    if (hasSupervisorDuplication) {
      setError(
        "This course and supervisor are already scheduled at the selected time."
      );
      return;
    }

    try {
      const newSchedule = await axios.post("/api/schedules", {
        courseId: selectedCourseId,
        roomId: selectedRoomId,
        supervisorId: selectedSupervisorId,
        day,
        startTime,
        endTime,
      });

      setSchedules((prevSchedules) => [...prevSchedules, newSchedule.data]);
      resetForm();
    } catch (err) {
      setError("Error creating schedule. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedCourseId("");
    setSelectedRoomId("");
    setSelectedSupervisorId("");
    setDay("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Schedule Supervisors</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSchedule} className="mb-4">
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          required
          className="border p-2 mr-2"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          required
          className="border p-2 mr-2"
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSupervisorId}
          onChange={(e) => setSelectedSupervisorId(e.target.value)}
          required
          className="border p-2 mr-2"
        >
          <option value="">Select Supervisor</option>
          {supervisors.map((supervisor) => (
            <option key={supervisor.id} value={supervisor.id}>
              {supervisor.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
          className="border p-2 mr-2"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="border p-2 mr-2"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Schedule
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Scheduled Courses</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Course</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Supervisor</th>
            <th className="border p-2">Day</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="border p-2">
                {
                  courses.find((course) => course.id === schedule.courseId)
                    ?.name
                }
              </td>
              <td className="border p-2">
                {rooms.find((room) => room.id === schedule.roomId)?.name}
              </td>
              <td className="border p-2">
                {
                  supervisors.find(
                    (supervisor) => supervisor.id === schedule.supervisorId
                  )?.name
                }
              </td>
              <td className="border p-2">{schedule.day}</td>
              <td className="border p-2">{schedule.startTime}</td>
              <td className="border p-2">{schedule.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default ScheduleSupervisorPage;
