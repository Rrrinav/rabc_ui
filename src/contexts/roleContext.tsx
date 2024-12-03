import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Role } from "../types/role";
import { api } from "../apis/api";
import { API_ROUTES } from "../apis/apiroutes";
import { toast } from "react-toastify";

const ROLE_CACHE_KEY = "rabc_role_cache";
// 5 minutes
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

interface RoleContextType {
  roles: Role[];
  isRolesLoading: boolean;
  fetchRoles: (forceRefresh?: boolean) => Promise<void>;
  createRole: (role: Role) => Promise<Role>;
  updateRole: (role: Role) => Promise<Role>;
  deleteRole: (roleId: string) => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isRolesLoading, setIsLoading] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const fetchRoles = useCallback(
    async (forceRefresh = false) => {
      try {
        if (!hasInitiallyLoaded) {
          setIsLoading(true);
        }

        const cachedData = localStorage.getItem(ROLE_CACHE_KEY);

        if (!forceRefresh && cachedData) {
          const { roles: cachedRoles, timestamp } = JSON.parse(cachedData);

          if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
            setRoles(cachedRoles);

            if (!hasInitiallyLoaded) {
              setHasInitiallyLoaded(true);
              setIsLoading(false);
            }

            return;
          }
        }

        const response = await api.get(API_ROUTES.ROLES);
        const fetchedRoles = response.data;

        setRoles(fetchedRoles);

        localStorage.setItem(
          ROLE_CACHE_KEY,
          JSON.stringify({
            roles: fetchedRoles,
            timestamp: Date.now(),
          }),
        );

        if (!hasInitiallyLoaded) {
          setHasInitiallyLoaded(true);
          setIsLoading(false);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error fetching roles";
        toast.error(errorMessage);
        console.error("Error fetching roles:", error);

        if (!hasInitiallyLoaded) {
          setHasInitiallyLoaded(true);
          setIsLoading(false);
        }
      }
    },
    [hasInitiallyLoaded],
  );

  useEffect(() => {
    fetchRoles(true);
  }, [fetchRoles]);

  const createRole = useCallback(
    async (roleData: Role) => {
      try {
        const { id, ...newRoleData } = roleData;
        console.log("roleData", roleData);
        const response = await api.post(API_ROUTES.ROLES, newRoleData);
        const newRole = response.data;

        const updatedRoles = [...roles, newRole];
        setRoles(updatedRoles);

        localStorage.setItem(
          ROLE_CACHE_KEY,
          JSON.stringify({
            roles: updatedRoles,
            timestamp: Date.now(),
          }),
        );
        fetchRoles(true);

        toast.success("Role created successfully.");
        return newRole;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error creating role";
        toast.error(errorMessage);
        console.error("Error creating role:", error);
        throw error;
      }
    },
    [roles],
  );

  const updateRole = useCallback(
    async (roleData: Role) => {
      try {
        const response = await api.put(API_ROUTES.ROLE(roleData.id), roleData);
        const updatedRole = response.data;

        const updatedRoles = roles.map((role) =>
          role.id === updatedRole.id ? updatedRole : role,
        );
        setRoles(updatedRoles);

        localStorage.setItem(
          ROLE_CACHE_KEY,
          JSON.stringify({
            roles: updatedRoles,
            timestamp: Date.now(),
          }),
        );

        toast.success("Role updated successfully.");
        fetchRoles(true);
        return updatedRole;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error updating role";
        toast.error(errorMessage);
        console.error("Error updating role:", error);
        throw error;
      }
    },
    [roles],
  );

  const deleteRole = useCallback(
    async (roleId: string) => {
      try {
        await api.delete(API_ROUTES.ROLE(roleId));

        const updatedRoles = roles.filter((role) => role.id !== roleId);
        setRoles(updatedRoles);
        fetchRoles(true);

        localStorage.setItem(
          ROLE_CACHE_KEY,
          JSON.stringify({
            roles: updatedRoles,
            timestamp: Date.now(),
          }),
        );

        toast.warn("Role deleted successfully.");
        fetchRoles(true);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error deleting role";
        toast.error(errorMessage);
        console.error("Error deleting role:", error);
        throw error;
      }
    },
    [roles],
  );

  const contextValue = useMemo(
    () => ({
      roles,
      isRolesLoading,
      fetchRoles,
      createRole,
      updateRole,
      deleteRole,
    }),
    [roles, isRolesLoading, fetchRoles, createRole, updateRole, deleteRole],
  );

  return (
    <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRoles must be used within a RoleProvider");
  }
  return context;
};
