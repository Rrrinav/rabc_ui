import React, { createContext, useState, useContext, useCallback } from "react";
import { User } from "../types/user";
import { api } from "../apis/api";
import { API_ROUTES } from "../apis/apiroutes";

interface UserContextType {
  users: User[];
  totalUsers: number;
  activeUsers: number;
  fetchUsers: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(API_ROUTES.USERS);
      const fetchedUsers = response.data;

      setUsers(fetchedUsers);
      setTotalUsers(fetchedUsers.length);

      const numActiveUsers = fetchedUsers.filter(
        (user: User) => user.status === "active",
      ).length;
      setActiveUsers(numActiveUsers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load users";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [users.length]);

  return (
    <UserContext.Provider
      value={{
        users,
        totalUsers,
        activeUsers,
        fetchUsers,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
