import React from "react";
import {
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
import StatCard from "../components/statcard";

const dashboardStats = {
  totalUsers: 124,
  activeUsers: 98,
  totalRoles: 5,
  recentActivities: [
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
  ],
};

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-bg-1 to-sec-bg-2 flex flex-col p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-color-text mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaUsers className="text-blue-500" />}
          title="Total Users"
          value={dashboardStats.totalUsers}
          color="bg-glass"
        />
        <StatCard
          icon={<FaShieldAlt className="text-green-500" />}
          title="Active Users"
          value={dashboardStats.activeUsers}
          color="bg-glass"
        />
        <StatCard
          icon={<FaChartLine className="text-purple-500" />}
          title="Total Roles"
          value={dashboardStats.totalRoles}
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
        <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {dashboardStats.recentActivities.map((activity) => (
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
          <QuickActionButton
            icon={<FaUsers />}
            title="Add New User"
            description="Create a new user account"
          />
          <QuickActionButton
            icon={<FaShieldAlt />}
            title="Create Role"
            description="Define a new role"
          />
          <QuickActionButton
            icon={<FaExclamationTriangle />}
            title="Audit Log"
            description="View system activities"
          />
        </div>
      </div>
    </div>
  );
};

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
