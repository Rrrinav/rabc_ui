import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { api } from "../apis/api";
import { API_ROUTES } from "../apis/apiroutes";
import { Role } from "../types/role";
import { User } from "../types/user";

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
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

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get(API_ROUTES.ROLES);
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      // Reset form when modal opens
      setNewUser({
        name: "",
        email: "",
        role: "Viewer",
      });
      setErrors({
        name: "",
        email: "",
        role: "",
      });
    }
  }, [isOpen, fetchRoles]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Name is required";
        }
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters long";
        }
        if (value.trim().length > 50) {
          return "Name must not exceed 50 characters";
        }
        return "";

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          return "Email is required";
        }
        if (!emailRegex.test(value.trim())) {
          return "Invalid email format";
        }
        return "";

      case "role":
        if (!value.trim()) {
          return "Role is required";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Update user state
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    // Validate the field and update errors
    const errorMessage = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const nameError = validateField("name", newUser.name);
    const emailError = validateField("email", newUser.email);
    const roleError = validateField("role", newUser.role);

    // Update errors state
    setErrors({
      name: nameError,
      email: emailError,
      role: roleError,
    });

    // Check if there are any validation errors
    if (nameError || emailError || roleError) {
      toast.error("Please correct the errors before submitting");
      return;
    }

    // If all validations pass, save the user
    onSave(newUser);
    onClose();
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
              placeholder="Enter name..."
              value={newUser.name}
              onChange={handleChange}
              className={`bg-sec-bg-2 w-full p-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email..."
              value={newUser.email}
              onChange={handleChange}
              className={`bg-sec-bg-2 w-full p-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
              defaultValue="Viewer"
              className={`bg-sec-bg-2 w-full p-2 border rounded-md ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
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
