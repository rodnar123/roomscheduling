// pages/dashboard/rooms.tsx
"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";

type Room = {
  id: number;
  name: string;
  capacity: number;
  type: string;
};

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("LECTURE");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch("/api/rooms");
    const data = await res.json();
    setRooms(data);
  };

  const handleCreateRoom = async () => {
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        capacity: parseInt(capacity),
        type,
      }),
    });

    if (res.ok) {
      fetchRooms();
      setRoomName("");
      setCapacity("");
    }
  };

  const handleDeleteRoom = async (id: string | number) => {
    await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    fetchRooms();
  };

  const handleAddRoomClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        capacity: parseInt(capacity),
        type,
      }),
    });

    if (res.ok) {
      fetchRooms();
      setRoomName("");
      setCapacity("");
      setIsModalOpen(false);
    }
  };

  const handleEditRoom = async () => {
    if (!editingRoom) {
      console.error("No room to edit");

      return;
    }

    const res = await fetch(`/api/rooms/${editingRoom.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        capacity: parseInt(capacity),
        type,
      }),
    });

    if (res.ok) {
      fetchRooms();
      setRoomName("");
      setCapacity("");
      setEditingRoom(null);
    }
  };

  const startEditing = (room: Room) => {
    setRoomName(room.name);
    setCapacity(room.capacity.toString());
    setType(room.type);
    setEditingRoom(room);
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-gray-800">Rooms</h1>
      <p className="mt-4 text-lg text-gray-600">Manage and view rooms.</p>

      {/* Room Form */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Room Name"
          className="border p-2 mr-2"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Capacity"
          className="border p-2 mr-2"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <select
          className="border p-2 mr-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="LECTURE">Lecture</option>
          <option value="LAB">Lab</option>
          <option value="TUTORIAL">Tutorial</option>
        </select>
        {editingRoom ? (
          <button
            className="bg-yellow-500 text-white px-4 py-2"
            onClick={handleEditRoom}
          >
            Update Room
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleCreateRoom}
          >
            Add Room
          </button>
        )}
      </div>

      {/* List of Rooms */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Capacity</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="border p-2">{room.name}</td>
              <td className="border p-2">{room.capacity}</td>
              <td className="border p-2">{room.type}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 mr-2"
                  onClick={() => startEditing(room)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1"
                  onClick={() => handleDeleteRoom(room.id)}
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

export default RoomsPage;
