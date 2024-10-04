"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";

interface Faculties {
  id: string | number;
  name: string;
}

const FacultiesPage = () => {
  const [fuculties, setFaculties] = useState<Faculties[]>([]);
  const [facultyName, setFacultyName] = useState("");
  const [editingFaculty, setEditingFaculty] = useState<Faculties | null>(null);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    const res = await fetch("/api/faculties");
    const data = await res.json();
    setFaculties(data);
  };

  const handleCreateFaculty = async () => {
    const res = await fetch("/api/faculties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: facultyName }),
    });

    if (res.ok) {
      fetchFaculties();
      setFacultyName("");
    }
  };

  const handleDeleteFaculty = async (id: string | number) => {
    await fetch(`/api/faculties/${id}`, { method: "DELETE" });
    fetchFaculties();
  };

  const handleEditFaculty = async () => {
    if (!editingFaculty) {
      console.error("No school to edit.");
      return;
    }
    const res = await fetch(`/api/schools/${editingFaculty.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: facultyName }),
    });

    if (res.ok) {
      fetchFaculties();
      setFacultyName("");
      setEditingFaculty(null);
    }
  };

  const startEditing = (faculty: Faculties) => {
    setFacultyName(faculty.name);
    setEditingFaculty(faculty);
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-6">Manage Faculties</h1>

      {/* School Form */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Faculty Name"
          className="border p-2 mr-2"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
        />
        {editingFaculty ? (
          <button
            className="bg-yellow-500 text-white px-4 py-2"
            onClick={handleEditFaculty}
          >
            Update Faculty
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleCreateFaculty}
          >
            Add Faculty
          </button>
        )}
      </div>

      {/* List of Schools */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fuculties.map((faculty) => (
            <tr key={faculty.id}>
              <td className="border p-2">{faculty.name}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 mr-2"
                  onClick={() => startEditing(faculty)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1"
                  onClick={() => handleDeleteFaculty(faculty.id)}
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

export default FacultiesPage;
