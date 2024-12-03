import React, { createContext, useState, useContext, useCallback } from "react";
import { Role } from "../types/role";
import { api } from "../apis/api";
import { API_ROUTES } from "../apis/apiroutes";

interface RoleContextType {
  roles: Role[];
  totalRoles: number;
  fetchRoles: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalRoles, setTotalRoles] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    // Check if data is already loaded to prevent unnecessary fetches
    if (roles.length > 0) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(API_ROUTES.ROLES);
      const fetchedRoles = response.data;

      setRoles(fetchedRoles);
      setTotalRoles(fetchedRoles.length);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load roles";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roles.length]);

  return (
    <RoleContext.Provider
      value={{
        roles,
        totalRoles,
        fetchRoles,
        loading,
        error,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRoles must be used within a RoleProvider");
  }
  return context;
};
