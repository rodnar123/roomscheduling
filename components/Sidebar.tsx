// components/Sidebar.tsx
import Link from "next/link";
import {
  FaTachometerAlt,
  FaDoorOpen,
  FaBook,
  FaCalendarAlt,
  FaDoorClosed,
  FaLockOpen,
} from "react-icons/fa"; // Importing some icons for styling
import { FaBookAtlas, FaHouse, FaPenRuler, FaPerson } from "react-icons/fa6";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed top-0 left-0 pt-16 flex flex-col shadow-lg">
      {/* Sidebar Links */}
      <Link
        href="/dashboard"
        className="text-lg font-semibold py-4 px-6 hover:bg-gray-700 flex items-center"
      >
        <FaTachometerAlt className="mr-3" /> Dashboard
      </Link>
      <Link
        href="/dashboard/faculties"
        className="text-lg font-semibold py-4 px-6 hover:bg-gray-700 flex items-center"
      >
        <FaDoorClosed className="mr-3" /> Faculties
      </Link>

      <Link
        href="/dashboard/schools"
        className="text-lg font-semibold py-4 px-6 hover:bg-gray-700 flex items-center"
      >
        <FaDoorOpen className="mr-3" /> Schools
      </Link>

      <Link
        href="/dashboard/teachers"
        className="text-lg font-semibold py-4 px-6 hover:bg-gray-700 flex items-center"
      >
        <FaPerson className="mr-3" /> Teachers
      </Link>

      <Link
        href="/dashboard/rooms"
        className="text-lg font-semibold py-4 px-6 hover:bg-gray-700 flex items-center"
      >
        <FaPenRuler className="mr-3" /> Rooms
      </Link>

      <Link
        href="/dashboard/courses"
        className="text-lg font-semibold py-4 px-6 hover:bg-gray-700 flex items-center"
      >
        <FaBook className="mr-3" /> Courses
      </Link>

      <Link
        href="/dashboard/schedules"
        className="text-lg font-semibold py-4 px-6 hover:bg-gray-700 flex items-center"
      >
        <FaCalendarAlt className="mr-3" /> Schedules
      </Link>
    </div>
  );
};

export default Sidebar;
