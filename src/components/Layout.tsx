import { useState } from "react";
import Sidebar from "./Sidebar"; // Updated Sidebar
import Navbar from "./Navbar"; // Updated Navbar
import { Outlet } from "react-router-dom";
import { UserProvider } from "../contexts/userContext"; // Updated UserProvider
import { RoleProvider } from "../contexts/roleContext"; // Updated RoleProvider

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-row gap-0 justify-between w-full">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onToggleSidebar={toggleSidebar}
      />
      {/* This overlay helps close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <UserProvider>
        <RoleProvider>
          <main className="flex-grow overflow-y-auto">
            <Navbar />
            <Outlet />
          </main>
        </RoleProvider>
      </UserProvider>
    </div>
  );
};

export default Layout;
