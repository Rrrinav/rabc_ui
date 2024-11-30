import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <div className="bg-primary-bg-1 shadow border-b-2 border-sec-bg-2">
      <div className="flex justify-between items-center py-4 px-7">
        <div className="text-color-text text-2xl font-bold">
          RBAC Admin Dashboard
        </div>
        <div className="bg-sec-bg-2 py-2 px-3 rounded-xl flex justify-between items-center gap-x-2.5 font-bold hover:bg-sec-bg-1 hover:shadow-lg hover:shadow-sec-bg-2 hover:scale-y-90 transition-all duration-300 ease-in-out">
          <FaUserCircle /> Logout
        </div>
      </div>
    </div>
  );
};

export default Navbar;
