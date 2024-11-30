import React from "react";
import { IconContext } from "react-icons";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  return (
    <div
      className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 backdrop-blur-md ${color} bg-opacity-90 border border-sec-bg-2`}
    >
      <IconContext.Provider value={{ size: "28" }}>
        <div className="p-3 rounded-full bg-white bg-opacity-10 ">{icon}</div>
      </IconContext.Provider>
      <div>
        <p className="text-sm text-primary-fg-1">{title}</p>
        <p className="text-2xl font-bold text-color-text">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
