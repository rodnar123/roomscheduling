"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";

interface Teacher {
  id: number;
  name: string;
  email: string;
}

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch the list of professors (teachers)
  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers");
    const data = await res.json();
    setTeachers(data);
  };

  // Add a new professor (teacher)
  const handleAddTeacher = async () => {
    const res = await fetch("/api/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, role: "PROFESSOR" }),
    });

    if (res.ok) {
      fetchTeachers();
      setName("");
      setEmail("");
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  // Edit an existing professor
  const handleEditTeacher = async () => {
    if (!editingTeacher) {
      console.error("No teacher to edit");
      return;
    }
    const res = await fetch(`/api/teachers/${editingTeacher.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      fetchTeachers();
      setName("");
      setEmail("");
      setEditingTeacher(null);
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  // Delete a professor
  const handleDeleteTeacher = async (id: number) => {
    await fetch(`/api/teachers/${id}`, { method: "DELETE" });
    fetchTeachers();
  };

  // Start editing a professor
  const startEditing = (teacher: Teacher) => {
    setName(teacher.name);
    setEmail(teacher.email);
    setEditingTeacher(teacher);
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-6">Manage Teachers (Professors)</h1>

      {/* Teacher Form */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Teacher Name"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Teacher Email"
          className="border p-2 mr-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {editingTeacher ? (
          <button
            className="bg-yellow-500 text-white px-4 py-2"
            onClick={handleEditTeacher}
          >
            Update Teacher
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleAddTeacher}
          >
            Add Teacher
          </button>
        )}
      </div>

      {/* List of Teachers */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td className="border p-2">{teacher.name}</td>
              <td className="border p-2">{teacher.email}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 mr-2"
                  onClick={() => startEditing(teacher)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1"
                  onClick={() => handleDeleteTeacher(teacher.id)}
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

export default TeachersPage;
