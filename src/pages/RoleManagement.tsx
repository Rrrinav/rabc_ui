import React, { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "../apis/api";
import { API_ROUTES } from "../apis/apiroutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheckSquare,
  FaRegSquare,
} from "react-icons/fa";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { Role } from "../types/role";
import { Permission } from "../types/permissions";

type SortDirection = "asc" | "desc";
type SortableKey = keyof Pick<Role, "name">;

const RoleManagement: React.FC = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  // Sorting State
  const [sortColumn, setSortColumn] = useState<SortableKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await api.get(API_ROUTES.PERMISSIONS);
      setPermissions(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error fetching permissions";
      toast.error(errorMessage);
      console.error("Error fetching permissions:", error);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);
  // Fetch Roles
  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ROUTES.ROLES);
      setRoles(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error fetching roles";
      toast.error(errorMessage);
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Roles Fetch
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Sorting Function
  const sortRoles = useCallback(
    (data: Role[]) => {
      if (!sortColumn) return data;

      return [...data].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    },
    [sortColumn, sortDirection],
  );

  // Filtered and Sorted Roles
  const processedRoles = useMemo(() => {
    // First filter
    const filtered = roles.filter((role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Then sort
    return sortRoles(filtered);
  }, [roles, searchTerm, sortRoles]);

  // Handle Column Sorting
  const handleSort = (column: SortableKey) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Edit Role
  const handleEdit = (role: Role) => {
    setCurrentRole({ ...role });
    setIsModalOpen(true);
  };

  // Delete Role
  const handleDelete = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete ${role.name} role?`)) {
      try {
        await api.delete(API_ROUTES.ROLE(role.id));
        toast.warn("Role deleted successfully.");
        await fetchRoles();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error deleting role";
        toast.error(errorMessage);
        console.error("Error deleting role:", error);
      }
    }
  };

  // Toggle Permission
  const togglePermission = (permission: string) => {
    if (!currentRole) return;

    setCurrentRole((prev) => {
      if (!prev) return null;
      const permissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions };
    });
  };

  // Save Role (Create/Update)
  const handleSaveRole = async () => {
    if (!currentRole) return;

    try {
      if (currentRole.id) {
        // Existing role - update
        await api.put(API_ROUTES.ROLE(currentRole.id), currentRole);
        toast.success("Role updated successfully.");
        await fetchRoles();
      } else {
        // New role - create
        const { id, ...newRole } = currentRole;
        await api.post(API_ROUTES.ROLES, newRole);
        toast.success("Role created successfully.");
        await fetchRoles();
      }

      handleModalClose();
      await fetchRoles();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error saving role";
      toast.error(errorMessage);
      console.error("Error saving role:", error);
    }
  };

  // Close Modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentRole(null);
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
          Role Name
          {sortColumn === "name" &&
            (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
          {sortColumn !== "name" && <FaSort className="opacity-50" />}
        </div>
      ),
    },
    { key_v: "Permissions", key: "permissions", sortable: false },
    { key_v: "Actions", key: "actions", sortable: false },
  ];

  return (
    <div className="bg-primary-bg-1 min-h-full p-6 space-y-6 bg-gradient-to-b from-primary-bg-1 to-sec-bg-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-color-text">Role Management</h1>
        <button
          className="flex items-center gap-2 bg-primary-bg-2 hover:bg-sec-bg-2 text-white px-4 py-2 rounded-md transition-all"
          onClick={() => {
            setCurrentRole({
              id: "",
              name: "",
              permissions: [],
            });
            setIsModalOpen(true);
          }}
        >
          <FaPlus />
          Add Role
        </button>
      </header>

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

      {isLoading ? (
        <div className="flex justify-center items-center min-h-full">
          <div className="spinner">Loading...</div>
        </div>
      ) : (
        <Table
          headers={headerData}
          data={processedRoles}
          renderRow={(role) => (
            <>
              <td className="p-4 w-1/3">{role.name}</td>
              <td className="p-4 w-1/3">
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs"
                    >
                      {perm.toUpperCase()}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-4 text-center w-1/3">
                <div className="flex justify-start gap-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-all"
                    title="Edit"
                    onClick={() => handleEdit(role)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-all"
                    title="Delete"
                    onClick={() => handleDelete(role)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      )}

      {/* Role Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={currentRole?.id ? "Edit Role" : "Create Role"}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-fg-2">
                Role Name
              </label>
              <input
                type="text"
                className=" bg-sec-bg-2 mt-1 px-1  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={currentRole?.name || ""}
                onChange={(e) =>
                  setCurrentRole((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
                placeholder="Enter role name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-fg-2 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {permissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={
                        currentRole?.permissions.includes(permission.name) ||
                        false
                      }
                      onChange={() => togglePermission(permission.name)}
                    />
                    <span className="mr-2">
                      {currentRole?.permissions.includes(permission.name) ? (
                        <FaCheckSquare className="text-green-500" />
                      ) : (
                        <FaRegSquare className="text-gray-400" />
                      )}
                    </span>
                    {permission.name.charAt(0).toUpperCase() +
                      permission.name.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                disabled={!currentRole?.name}
              >
                Save Role
              </button>
            </div>
          </div>
        </Modal>
      )}

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

export default RoleManagement;
