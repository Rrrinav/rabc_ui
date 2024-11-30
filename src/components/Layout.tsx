import { useState } from "react";
import Sidebar from "./Sidebar"; // Updated Sidebar

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
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
    </div>
  );
};

export default Layout;
