import React, { useCallback, useEffect, useState } from "react";
import {
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaExclamationTriangle,
  FaRegSquare,
  FaCheckSquare,
} from "react-icons/fa";
import StatCard from "../components/statcard";
import { api } from "../apis/api";
import { API_ROUTES } from "../apis/apiroutes";
import { User } from "../types/user";
import { Role } from "../types/role";
import NewUserModal from "../components/NewUserModal";
import Modal from "../components/Modal";
import { ToastContainer } from "react-toastify";
import { Permission } from "../types/permissions";
import { useUsers } from "../contexts/userContext";
import { useRoles } from "../contexts/roleContext";

const Dashboard: React.FC = () => {
  const {
    users,
    isUsersLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useUsers();

  const {
    roles,
    isRolesLoading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  } = useRoles();
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isNewUserModalOpen, setNewUserModalOpen] = useState<boolean>(false);
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [totalRoles, setTotalRoles] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentActivities, setRecentActivities] = useState<
    { id: number; action: string; details: string; timestamp: string }[]
  >([]);

  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    setTotalUsers(users.length);
    setTotalRoles(roles.length);
    const numActiveUsers = users.filter(
      (user: User) => user.status === "active",
    ).length;
    setActiveUsers(numActiveUsers);
  }, [users, roles]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const permissionsResponse = await api.get(API_ROUTES.PERMISSIONS);

      setPermissions(permissionsResponse.data);

      // Placeholder activities
      const activities = [
        {
          id: 1,
          action: "User Added",
          details: "John Doe",
          timestamp: "2 hours ago",
        },
        {
          id: 2,
          action: "Role Updated",
          details: "Marketing Team",
          timestamp: "4 hours ago",
        },
        {
          id: 3,
          action: "Permission Modified",
          details: "Admin Access",
          timestamp: "6 hours ago",
        },
      ];
      setRecentActivities(activities);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchData();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const handleModalClose = useCallback(() => {
    setRoleModalOpen(false);
    setCurrentRole(null);
    setNewUserModalOpen(false);
  }, []);

  const handleModalUserSave = useCallback(
    async (updatedUser: User) => {
      createUser(updatedUser);
      handleModalClose();
    },
    [handleModalClose, fetchData],
  );

  const handleSaveRole = useCallback(async () => {
    if (!currentRole) return;

    await createRole(currentRole);

    handleModalClose();
  }, [currentRole, handleModalClose, fetchData]);

  const togglePermission = useCallback((permission: string) => {
    setCurrentRole((prev) => {
      if (!prev) return null;
      const permissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions };
    });
  }, []);

  //  Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary-bg-1">
        <div className="animate-pulse w-16 h-16 bg-blue-500 rounded-full"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-100 text-red-800">
        {error}
        <button
          onClick={fetchData}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-bg-1 to-sec-bg-2 flex flex-col p-6">
      <h1 className="text-4xl font-bold text-color-text mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaUsers className="text-blue-500" />}
          title="Total Users"
          value={totalUsers}
          color="bg-glass"
        />
        <StatCard
          icon={<FaShieldAlt className="text-green-500" />}
          title="Active Users"
          value={activeUsers}
          color="bg-glass"
        />
        <StatCard
          icon={<FaChartLine className="text-purple-500" />}
          title="Total Roles"
          value={totalRoles}
          color="bg-glass"
        />
        <StatCard
          icon={<FaChartLine className="text-orange-500" />}
          title="User Growth"
          value="12.5%"
          color="bg-glass"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-glass p-6 rounded-lg shadow-lg backdrop-blur-md text-color-text">
        <h2 className="font-semibold mb-4 text-sm sm:text-md md:text-lg lg:text-xl">
          Recent Activities
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              action={activity.action}
              details={activity.details}
              timestamp={activity.timestamp}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-color-text">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div onClick={() => setNewUserModalOpen(true)}>
            <QuickActionButton
              icon={<FaUsers />}
              title="Add New User"
              description="Create a new user account"
            />
          </div>
          <div
            onClick={() => {
              setCurrentRole({
                id: "",
                name: "",
                permissions: [],
              });
              setRoleModalOpen(true);
            }}
          >
            <QuickActionButton
              icon={<FaShieldAlt />}
              title="Create Role"
              description="Define a new role"
            />
          </div>
          <QuickActionButton
            icon={<FaExclamationTriangle />}
            title="Audit Log"
            description="View system activities"
          />
        </div>
      </div>

      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={handleModalClose}
        onSave={handleModalUserSave}
      />

      {roleModalOpen && (
        <Modal
          isOpen={roleModalOpen}
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
                className="bg-sec-bg-2 mt-1 px-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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

// Activity Item Component
interface ActivityItemProps {
  action: string;
  details: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  action,
  details,
  timestamp,
}) => (
  <div className="flex justify-between items-center p-4 bg-glass rounded-lg backdrop-blur-sm">
    <div>
      <p className="font-semibold text-color-text">{action}</p>
      <p className="text-primary-fg-1 text-sm">{details}</p>
    </div>
    <span className="text-primary-fg-2 text-sm">{timestamp}</span>
  </div>
);

// Quick Action Button Component
interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  title,
  description,
}) => (
  <div
    className="bg-glass shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer flex items-center space-x-4 backdrop-blur-md"
    aria-label={`Quick action: ${title}`}
  >
    <div className="p-3 bg-gray-900 rounded-full opacity-30">
      <div>{icon}</div>
    </div>
    <div>
      <h3 className="font-semibold text-color-text">{title}</h3>
      <p className="text-primary-fg-2 text-sm">{description}</p>
    </div>
  </div>
);

export default Dashboard;
