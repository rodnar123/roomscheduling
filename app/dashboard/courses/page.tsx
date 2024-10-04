"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";

// Define the structure for Course, Teacher, and School based on your updated schema
interface Course {
  id: number;
  name: string;
  code: string;
  teacherId: number;
  teachers: {
    id: number;
    name: string;
  };
  schoolId: number;
  school: {
    id: number;
    name: string;
  };
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]); // For selecting schools
  const [teachers, setTeachers] = useState<{ id: number; name: string }[]>([]); // For selecting teachers
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Fetch data on component load
  useEffect(() => {
    fetchCourses();
    fetchSchools();
    fetchTeachers();
  }, []);

  // Fetch all courses
  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data);
  };

  // Fetch all schools
  const fetchSchools = async () => {
    const res = await fetch("/api/schools");
    const data = await res.json();
    setSchools(data);
  };

  // Fetch all teachers (professors) from the teachers API
  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers");
    const data = await res.json();
    setTeachers(data);
  };

  // Handle creating a new course
  const handleCreateCourse = async () => {
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: courseName,
        code: courseCode,
        teacherId: parseInt(teacherId),
        schoolId: parseInt(schoolId),
      }),
    });

    if (res.ok) {
      fetchCourses(); // Refresh the course list
      setCourseName("");
      setCourseCode("");
      setTeacherId("");
      setSchoolId("");
    } else {
      const { error } = await res.json();
      alert(error); // Display error message if there is an issue
    }
  };

  // Handle editing an existing course
  const handleEditCourse = async () => {
    if (!editingCourse) return;

    const res = await fetch(`/api/courses/${editingCourse.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: courseName,
        code: courseCode,
        teacherId: parseInt(teacherId),
        schoolId: parseInt(schoolId),
      }),
    });

    if (res.ok) {
      fetchCourses();
      setCourseName("");
      setCourseCode("");
      setTeacherId("");
      setSchoolId("");
      setEditingCourse(null); // Clear editing state
    }
  };

  // Handle editing mode
  const startEditing = (course: Course) => {
    setCourseName(course.name);
    setCourseCode(course.code);
    setTeacherId(course.teacherId.toString());
    setSchoolId(course.schoolId.toString());
    setEditingCourse(course);
  };

  // Handle deleting a course
  const handleDeleteCourse = async (id: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });
      fetchCourses(); // Refresh the course list after deletion
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-6">Manage Courses</h1>

      {/* Course Form */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Course Name"
          className="border p-2 mr-2"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course Code"
          className="border p-2 mr-2"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
        <select
          className="border p-2 mr-2"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2 mr-2"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
        >
          <option value="">Select School</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
        {editingCourse ? (
          <button
            className="bg-yellow-500 text-white px-4 py-2"
            onClick={handleEditCourse}
          >
            Update Course
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleCreateCourse}
          >
            Add Course
          </button>
        )}
      </div>

      {/* List of Courses */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Teacher</th>
            <th className="border p-2">School</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="border p-2">{course.name}</td>
              <td className="border p-2">{course.code}</td>
              <td className="border p-2">{course.teachers.name}</td>
              <td className="border p-2">{course.school.name}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 mr-2"
                  onClick={() => startEditing(course)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default CoursesPage;
