import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: 3, name: "Mark Johnson", email: "mark@example.com", role: "Viewer" },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-primary-bg-1 h-screen p-6 space-y-6 bg-gradient-to-b from-primary-bg-1 to-sec-bg-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-color-text">User Management</h1>
        <button className="flex items-center gap-2 bg-primary-bg-2 hover:bg-sec-bg-2 text-white px-4 py-2 rounded-md transition-all">
          <FaPlus />
          Add User
        </button>
      </header>

      <div className="flex items-center bg-sec-bg-1 rounded-md overflow-hidden border border-gray-50">
        <div className="px-4 text-color-text">
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 bg-transparent outline-none text-color-text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto shadow-xl shadow-gray-800 border border-gray-100 ">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="bg-primary-bg-2 text-white">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="odd:bg-sec-bg-1 even:bg-sec-bg-2 hover:bg-primary-bg-1 transition-all"
                >
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-all"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-all"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-500 font-semibold"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
