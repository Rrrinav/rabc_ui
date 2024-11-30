import React, { useEffect, useState } from "react";

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: any) => void;
}

const NewUserModal: React.FC<NewUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer", // Default role
  });

  useEffect(() => {
    setNewUser({
      name: "",
      email: "",
      role: "Viewer",
    });
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newUser); // Pass the new user data back to parent
    onClose(); // Close modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-primary-bg-1 p-6 rounded-md w-96 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="name..."
              value={newUser.name}
              onChange={handleChange}
              className=" bg-sec-bg-2 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email..."
              value={newUser.email}
              onChange={handleChange}
              className="bg-sec-bg-2  w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={newUser.role}
              onChange={handleChange}
              defaultValue="user"
              className="bg-sec-bg-2  w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUserModal;
