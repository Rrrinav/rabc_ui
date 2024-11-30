import React from "react";
import {
  FaList,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSidebar: () => void; // For toggle action
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onToggleSidebar,
}) => {
  return (
    <aside
      className={`
        sticky top-0 left-0 h-svh z-50 transition-all items-center duration-300 ease-in-out text-nowrap overflow-hidden
        ${isOpen ? "w-64" : "w-20"}
        pt-8 shadow-lg bg-primary-bg-2 border border-r-2 border-sec-bg-2
      `}
    >
      <div className="flex justify-between items-center px-6 ">
        <div className="text-color-text text-2xl font-bold cursor-pointer">
          <div onClick={onToggleSidebar}>
            {isOpen ? <FaTimes /> : <FaList />}
          </div>
        </div>
      </div>

      <div className="px-4 mt-10">
        <nav>
          <ul className="space-y-10">
            <SidebarNavLink
              to="/"
              label="Dashboard"
              icon={<FaTachometerAlt />}
              isOpen={isOpen}
              onClose={onClose}
            />
            <SidebarNavLink
              to="/users"
              label="User Management"
              icon={<FaUsers />}
              isOpen={isOpen}
              onClose={onClose}
            />
            <SidebarNavLink
              to="/roles"
              label="Role Management"
              icon={<FaUserShield />}
              isOpen={isOpen}
              onClose={onClose}
            />
          </ul>
        </nav>
      </div>
    </aside>
  );
};

interface SidebarNavLinkProps {
  to: string;
  label: string;
  icon: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  to,
  label,
  icon,
  isOpen,
  onClose,
}) => {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClose}
        className={({ isActive }) => `
          flex items-center space-x-3 px-4 py-2 rounded-md transition-colors duration-200
          ${
            isOpen
              ? `${isActive ? "bg-sec-bg-2 font-semibold" : "hover:bg-sec-bg-1 hover:underline"}`
              : `justify-center ${isActive ? "bg-sec-bg-2" : "hover:bg-sec-bg-1"}`
          }
        `}
        title={!isOpen ? label : undefined}
      >
        <div className="text-xl">{icon}</div>
        {isOpen && <span>{label}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;
