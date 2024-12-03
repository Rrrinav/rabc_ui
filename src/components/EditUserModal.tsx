import React, { useState, useEffect, useCallback } from "react";
import { User } from "../types/user";
import { Role } from "../types/role";
import { api } from "../apis/api";
import { API_ROUTES } from "../apis/apiroutes";

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: any) => void;
}

const DEFAULT_ROLE = "user";

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);

  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || DEFAULT_ROLE,
  });

  const fetchROles = useCallback(async () => {
    try {
      const response = await api.get(API_ROUTES.ROLES);
      setRoles(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [roles]);

  useEffect(() => {
    fetchROles();
  }, [fetchROles, roles]);

  // Sync form data when modal opens with a new user
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  useEffect(() => {
    setFormData({
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || DEFAULT_ROLE 
    });
  }, [user, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.email && formData.role) {
      onSave(formData);
      onClose();
    } else {
      alert("Please fill in all fields");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 ">
      <div className="bg-primary-bg-1 p-6 rounded-md w-1/3 border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-sec-bg-2 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-sec-bg-2  w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-sec-bg-2 w-full p-2 border rounded"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
