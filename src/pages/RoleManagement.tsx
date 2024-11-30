import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const RoleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample role data
  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", description: "Full access to all resources" },
    { id: 2, name: "Editor", description: "Can edit content" },
    { id: 3, name: "Viewer", description: "Read-only access" },
  ]);

  // Filtered roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-primary-bg-1 h-screen p-6 space-y-6 bg-gradient-to-b from-primary-bg-1 to-sec-bg-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-color-text">Role Management</h1>
        <button className="flex items-center gap-2 bg-primary-bg-2 hover:bg-sec-bg-2 text-white px-4 py-2 rounded-md transition-all">
          <FaPlus />
          Add Role
        </button>
      </header>

      {/* Search Bar */}
      <div className="flex items-center bg-sec-bg-1 rounded-md overflow-hidden border border-gray-50">
        <div className="px-4 text-color-text">
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Search roles..."
          className="w-full p-2 bg-transparent outline-none text-color-text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Role Table */}
      <div className="overflow-x-auto border border-gray-50">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="bg-primary-bg-2 text-white">
              <th className="p-4">Role Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr
                  key={role.id}
                  className="odd:bg-sec-bg-1 even:bg-sec-bg-2 hover:bg-primary-bg-1 transition-all"
                >
                  <td className="p-4">{role.name}</td>
                  <td className="p-4">{role.description}</td>
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
                  colSpan={3}
                  className="p-4 text-center text-gray-500 font-semibold"
                >
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManagement;
