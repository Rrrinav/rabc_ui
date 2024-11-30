import React from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import RoleManagement from "./pages/RoleManagement";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Dashboard />, // Landing page for the dashboard
      },
      {
        path: "users",
        element: <UserManagement />, // User management page
      },
      {
        path: "roles",
        element: <RoleManagement />, // Role management page
      },
    ],
  },
  {
    path: "*",
    element: <Error />, // Catch-all route for undefined paths
  },
]);

export default router;
