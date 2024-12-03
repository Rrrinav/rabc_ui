import React, { useState, useEffect, useMemo, useCallback } from "react";
import { User } from "../types/user";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaRegDotCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import Table from "../components/Table";
import EditUserModal from "../components/EditUserModal";
import NewUserModal from "../components/NewUserModal";
import { useUsers } from "../contexts/userContext";

// Constants
const USER_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

type SortDirection = "asc" | "desc";
type SortableKey = keyof Pick<User, "name" | "email" | "role" | "status">;

const UserManagement: React.FC = () => {
  const {
    users,
    isUsersLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useUsers();
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isNewUserModalOpen, setNewUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Sorting State
  const [sortColumn, setSortColumn] = useState<SortableKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Initial Users Fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sorting Function
  const sortUsers = useCallback(
    (data: User[]) => {
      if (!sortColumn) return data;

      return [...data].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        // Handle potential undefined values
        if (valueA == null) return sortDirection === "asc" ? 1 : -1;
        if (valueB == null) return sortDirection === "asc" ? -1 : 1;

        // Compare strings case-insensitively
        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // For other types (like numbers or booleans)
        return sortDirection === "asc"
          ? (valueA as any) > (valueB as any)
            ? 1
            : -1
          : (valueA as any) < (valueB as any)
            ? 1
            : -1;
      });
    },
    [sortColumn, sortDirection],
  );

  // Filtered and Sorted Users
  const processedUsers = useMemo(() => {
    // First filter
    const filtered = users.filter((user) =>
      ["name", "email"].some((key) =>
        user[key as keyof User]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );

    // Then sort
    return sortUsers(filtered);
  }, [users, searchTerm, sortUsers]);

  // Handle Column Sorting
  const handleSort = (column: SortableKey) => {
    // If same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If new column, start with ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Table Header with Sorting
  const headerData = [
    {
      key_v: "Name",
      key: "name",
      sortable: true,
      renderHeader: () => (
        <div
          className="flex items-center cursor-pointer hover:opacity-70"
          onClick={() => handleSort("name")}
        >
          Name
          {sortColumn === "name" &&
            (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
          {sortColumn !== "name" && <FaSort className="opacity-50" />}
        </div>
      ),
    },
    {
      key_v: "Email",
      key: "email",
      sortable: true,
      renderHeader: () => (
        <div
          className="flex items-center cursor-pointer hover:opacity-70"
          onClick={() => handleSort("email")}
        >
          Email
          {sortColumn === "email" &&
            (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
          {sortColumn !== "email" && <FaSort className="opacity-50" />}
        </div>
      ),
    },
    {
      key_v: "Role",
      key: "role",
      sortable: true,
      renderHeader: () => (
        <div
          className="flex items-center cursor-pointer hover:opacity-70"
          onClick={() => handleSort("role")}
        >
          Role
          {sortColumn === "role" &&
            (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
          {sortColumn !== "role" && <FaSort className="opacity-50" />}
        </div>
      ),
    },
    {
      key_v: "Status",
      key: "status",
      sortable: true,
      renderHeader: () => (
        <div
          className="flex items-center cursor-pointer hover:opacity-70"
          onClick={() => handleSort("status")}
        >
          Status
          {sortColumn === "status" &&
            (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
          {sortColumn !== "status" && <FaSort className="opacity-50" />}
        </div>
      ),
    },
    { key_v: "Actions", key: "actions", sortable: false },
  ];

  // Rest of the component remains the same as in previous implementation
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUser(user.id);
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setNewUserModalOpen(false);
    setCurrentUser(null);
  };

  const handleModalSave = async (updatedUser: User) => {
    if (updatedUser.id) {
      // User already exists, so update
      await updateUser(updatedUser);
    } else {
      // New user, so create
      await createUser(updatedUser);
    }
    handleModalClose();
    await fetchUsers();
  };

  const handleToggleStatus = async (user: User) => {
    await toggleUserStatus(user);
  };

  if (isUsersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-primary-bg-1 m-h-full p-6 space-y-6 bg-gradient-to-b from-primary-bg-1 to-sec-bg-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-color-text">User Management</h1>
        <button
          className="flex items-center gap-2 bg-primary-bg-2 hover:bg-sec-bg-2 text-white px-4 py-2 rounded-md transition-all"
          onClick={() => setNewUserModalOpen(true)}
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
        data={processedUsers}
        renderRow={(user) => (
          <>
            <td className="p-4 w-1/4">{user.name}</td>
            <td className="p-4 w-1/4">{user.email}</td>
            <td className="p-4 w-1/4">{user.role.toUpperCase()}</td>
            <td className="p-4 text-center w-1/4">
              <button
                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all ${
                  user.status === USER_STATUSES.ACTIVE
                    ? "bg-green-500 hover:bg-green-300 text-white"
                    : "bg-red-500 hover:bg-red-300 text-white"
                }`}
                onClick={() => handleToggleStatus(user)}
              >
                <FaRegDotCircle />
                {user.status === USER_STATUSES.ACTIVE ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="p-4 text-center w-1/4">
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          zIndex: 9999,
        }}
        toastStyle={{
          backgroundColor: "#253745",
          color: "#F0F8FF",
          fontWeight: 600,
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #4A5C6A",
        }}
        progressStyle={{
          background: "linear-gradient(to right, #4A5C6A, #9BA8AB)",
        }}
        closeButtonStyle={{
          color: "#9BA8AB",
          opacity: 0.7,
          transition: "opacity 0.3s ease",
        }}
        icon={false}
        className="custom-toast-container"
      />
    </div>
  );
};

export default UserManagement;
