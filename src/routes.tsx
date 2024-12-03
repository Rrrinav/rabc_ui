import React from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import RoleManagement from "./pages/RoleManagement";
import Error from "./pages/Error";
import AdminLogin from "./pages/AdminLogin";
import App from "./App";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { useAdminAuth } from "./contexts/AdminAuthContext";

// Wrapper component for protected routes
const ProtectedRoute = () => {
  const { isLoggedIn } = useAdminAuth();

  if (!isLoggedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AdminAuthProvider>
        <AdminLogin />
      </AdminAuthProvider>
    ),
  },
  {
    path: "/",
    element: (
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    ),
    errorElement: <Error />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "roles",
            element: <RoleManagement />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);

export default router;
