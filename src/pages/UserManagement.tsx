import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaRegDotCircle,
} from "react-icons/fa";
import Table from "../components/Table";
import EditUserModal from "../components/EditUserModal";
import NewUserModal from "../components/NewUserModal";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isNewUserModalOpen, setNewUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const headerData = [
    { label: 1, key: "Name" },
    { label: 2, key: "Email" },
    { label: 3, key: "Role" },
    { label: 4, key: "Status" },
    { label: 5, key: "Actions" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      // check if all users have different keys
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleEdit = (user: any) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = async (user: any) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/users/${user.id}`);
        // setUsers(users.filter((u) => u.id !== user.id)); // Properly remove user from the state
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleNewUserModalOpen = () => {
    setNewUserModalOpen(true); // Open new user modal
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setNewUserModalOpen(false); // Close new user modal
    setCurrentUser(null);
  };

  const handleModalSave = async (updatedUser: any) => {
    try {
      if (updatedUser.id) {
        // Update existing user
        const response = await axios.put(
          `http://localhost:5000/users/${updatedUser.id}`,
          updatedUser,
        );
        // setUsers((prevUsers) =>
        //   prevUsers.map((user) =>
        //     user.id === updatedUser.id ? response.data : user,
        //   ),
        //);
        fetchUsers();
      } else {
        // Add new user
        const response = await axios.post(
          "http://localhost:5000/users",
          updatedUser,
        );
        // setUsers((prevUsers) => {
        //   // Check if the user already exists to prevent duplicates
        //   const existingUser = prevUsers.find(
        //     (u) => u.email === response.data.email,
        //   );
        // });
        fetchUsers();
      }

      // Close modals after successful operation
      setEditModalOpen(false);
      setNewUserModalOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      // Optionally show an error message to the user
    }
  };

  const handleToggleStatus = async (user: any) => {
    const updatedStatus = user.status === "active" ? "inactive" : "active";

    try {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: updatedStatus } : u,
        ),
      );
      // Update on the server
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        status: updatedStatus,
      });

      // Update locally
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };
  return (
    <div className="bg-primary-bg-1 h-screen p-6 space-y-6 bg-gradient-to-b from-primary-bg-1 to-sec-bg-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-color-text">User Management</h1>
        <button
          className="flex items-center gap-2 bg-primary-bg-2 hover:bg-sec-bg-2 text-white px-4 py-2 rounded-md transition-all"
          onClick={handleNewUserModalOpen}
        >
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

      <Table
        headers={headerData}
        data={filteredUsers}
        renderRow={(user) => (
          <>
            <td className="p-4 w-1/4">{user.name}</td> {/* Fixed width */}
            <td className="p-4 w-1/4">
              {user.email}
            </td> {/* Fixed width */}
            <td className="p-4 w-1/4">
              {user.role}
            </td> {/* Fixed width */}
            <td className="p-4 text-center w-1/4">
              {" "}
              {/* Fixed width */}
              <button
                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all ${
                  user.status === "active"
                    ? "bg-green-500 hover:bg-green-300 text-white"
                    : "bg-red-500 hover:bg-red-300 text-white"
                }`}
                onClick={() => handleToggleStatus(user)}
              >
                <FaRegDotCircle />
                {user.status === "active" ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="p-4 text-center w-1/4">
              {" "}
              {/* Fixed width */}
              <div className="flex justify-start gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-all"
                  title="Edit"
                  onClick={() => handleEdit(user)}
                >
                  <FaEdit />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-all"
                  title="Delete"
                  onClick={() => handleDelete(user)}
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </>
        )}
      />

      <EditUserModal
        user={currentUser}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />

      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default UserManagement;
