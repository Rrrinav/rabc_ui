import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { User } from "../types/user";
import { api } from "../apis/api";
import { API_ROUTES } from "../apis/apiroutes";
import { toast } from "react-toastify";

const USER_CACHE_KEY = "rabc_user_cache";
const CACHE_EXPIRATION_MS = 60 * 60 * 1000;

interface UserContextType {
  users: User[];
  isUsersLoading: boolean;
  fetchUsers: (forceRefresh?: boolean) => Promise<void>;
  createUser: (user: Omit<User, "id">) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserStatus: (user: User) => Promise<User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsLoading] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const USER_STATUSES = {
    ACTIVE: "active",
    INACTIVE: "inactive",
  } as const;

  const fetchUsers = useCallback(
    async (forceRefresh = false) => {
      try {
        // Only set loading to true on first load
        if (!hasInitiallyLoaded) {
          setIsLoading(true);
        }

        const cachedData = localStorage.getItem(USER_CACHE_KEY);

        if (!forceRefresh && cachedData) {
          const { users: cachedUsers, timestamp } = JSON.parse(cachedData);

          if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
            // Stealthily update without loading state
            setUsers(cachedUsers);

            if (!hasInitiallyLoaded) {
              setHasInitiallyLoaded(true);
              setIsLoading(false);
            }

            return;
          }
        }

        const response = await api.get(API_ROUTES.USERS);
        const fetchedUsers = response.data;

        // Stealthily update
        setUsers(fetchedUsers);

        localStorage.setItem(
          USER_CACHE_KEY,
          JSON.stringify({
            users: fetchedUsers,
            timestamp: Date.now(),
          }),
        );

        // Only toggle loading on first load
        if (!hasInitiallyLoaded) {
          setHasInitiallyLoaded(true);
          setIsLoading(false);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error fetching users";
        toast.error(errorMessage);
        console.error("Error fetching users:", error);

        // Ensure loading is set to false even on error
        if (!hasInitiallyLoaded) {
          setHasInitiallyLoaded(true);
          setIsLoading(false);
        }
      }
    },
    [hasInitiallyLoaded],
  );

  // Automatically fetch users on initial mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (userData: Omit<User, "id">) => {
      try {
        const response = await api.post(API_ROUTES.USERS, userData);
        const newUser = response.data;

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);

        localStorage.setItem(
          USER_CACHE_KEY,
          JSON.stringify({
            users: updatedUsers,
            timestamp: Date.now(),
          }),
        );

        toast.success("User created successfully.");
        fetchUsers(true);
        return newUser;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error creating user";
        toast.error(errorMessage);
        console.error("Error creating user:", error);
        throw error;
      }
    },
    [users],
  );

  const updateUser = useCallback(
    async (userData: User) => {
      try {
        const response = await api.put(API_ROUTES.USER(userData.id), userData);
        const updatedUser = response.data;

        const updatedUsers = users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        );

        setUsers(updatedUsers);
        localStorage.setItem(
          USER_CACHE_KEY,
          JSON.stringify({
            users: updatedUsers,
            timestamp: Date.now(),
          }),
        );

        toast.success("User updated successfully.");
        fetchUsers(true);
        return updatedUser;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error updating user";
        toast.error(errorMessage);
        console.error("Error updating user:", error);
        throw error;
      }
    },
    [users],
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      try {
        await api.delete(API_ROUTES.USER(userId));
        fetchUsers(true);
        localStorage.setItem(
          USER_CACHE_KEY,
          JSON.stringify({
            users: users,
            timestamp: Date.now(),
          }),
        );

        toast.warn("User deleted successfully.");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error deleting user";
        toast.error(errorMessage);
        console.error("Error deleting user:", error);
        throw error;
      }
    },
    [users],
  );

  const toggleUserStatus = useCallback(
    async (user: User) => {
      try {
        const updatedStatus =
          user.status === USER_STATUSES.ACTIVE
            ? USER_STATUSES.INACTIVE
            : USER_STATUSES.ACTIVE;

        const updatedUser = { ...user, status: updatedStatus };

        const response = await api.patch(API_ROUTES.USER(user.id), {
          status: updatedStatus,
        });

        const serverUpdatedUser = response.data;

        const updatedUsers = users.map((u) =>
          u.id === user.id ? serverUpdatedUser : u,
        );

        setUsers(updatedUsers);
        localStorage.setItem(
          USER_CACHE_KEY,
          JSON.stringify({
            users: updatedUsers,
            timestamp: Date.now(),
          }),
        );

        return serverUpdatedUser;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error updating user status";
        toast.error(errorMessage);
        console.error("Error updating user status:", error);
        throw error;
      }
    },
    [users],
  );

  const contextValue = useMemo(
    () => ({
      users,
      isUsersLoading,
      fetchUsers,
      createUser,
      updateUser,
      deleteUser,
      toggleUserStatus,
    }),
    [
      users,
      isUsersLoading,
      fetchUsers,
      createUser,
      updateUser,
      deleteUser,
      toggleUserStatus,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
