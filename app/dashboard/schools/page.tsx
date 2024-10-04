"use client";

import DashboardLayout from "@/components/DashboardLayout";

import { useState, useEffect } from "react";

interface School {
  id: number;
  name: string;
  facultyId: string;
  faculties: {
    id: number;
    name: string;
  };
}

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [faculties, setFaculties] = useState<School[]>([]);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  useEffect(() => {
    fetchFaculties();
    fetchSchools();
  }, []);

  const fetchFaculties = async () => {
    const res = await fetch("/api/faculties");
    const data = await res.json();
    setFaculties(data);
  };

  const fetchSchools = async () => {
    const res = await fetch("/api/schools");
    const data = await res.json();
    setSchools(data);
  };

  const handleCreateSchool = async () => {
    const res = await fetch("/api/schools", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: schoolName,
        facultyId: parseInt(facultyId),
      }),
    });

    if (res.ok) {
      fetchFaculties();
      setSchoolName("");
      setFacultyId("");
    }
  };

  const handleDeleteSchool = async (id: string | number) => {
    await fetch(`/api/schools/${id}`, { method: "DELETE" });
    fetchSchools();
  };

  const handleEditSchool = async () => {
    if (!editingSchool) {
      console.error("No school to edit");
      return;
    }
    const res = await fetch(`/api/schools/${editingSchool.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: schoolName, schoolId: parseInt(facultyId) }),
    });

    if (res.ok) {
      fetchFaculties();
      setSchoolName("");
      setFacultyId("");
      setEditingSchool(null);
    }
  };

  const startEditing = (school: School) => {
    setSchoolName(school.name);
    setFacultyId(school.facultyId.toString());
    setEditingSchool(school);
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-6">Manage Schools</h1>

      {/* Faculty Form */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="School Name"
          className="border p-2 mr-2"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />
        <select
          className="border p-2 mr-2"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
        >
          <option value="">Select Faculty</option>
          {faculties.map((facultyId) => (
            <option key={facultyId.id} value={facultyId.id}>
              {facultyId.name}
            </option>
          ))}
        </select>
        {editingSchool ? (
          <button
            className="bg-yellow-500 text-white px-4 py-2"
            onClick={handleEditSchool}
          >
            Update School
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleCreateSchool}
          >
            Add School
          </button>
        )}
      </div>

      {/* List of Faculties */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Faculty</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id}>
              <td className="border p-2">{school.name}</td>
              <td className="border p-2">
                {school.faculties ? school.faculties.name : ""}
              </td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 mr-2"
                  onClick={() =>
                    startEditing({
                      id: school.id,
                      name: school.name,
                      facultyId: school.facultyId,
                      faculties: school.faculties,
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1"
                  onClick={() => handleDeleteSchool(school.id)}
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

export default SchoolsPage;
