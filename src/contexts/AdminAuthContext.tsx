import React, { createContext, useState, useContext, ReactNode } from "react";

// Admin User Type
export interface AdminUser {
  username: string;
  role: "admin";
}

export interface AdminAuthContextType {
  user: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoggedIn: boolean;
}

// Admin Credentials (you should replace this with more secure methods)
const ADMIN_CREDENTIALS = [{ username: "admin", password: "admin123" }];

// Admin Authentication Context
const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isLoggedIn: false,
});

// Authentication Provider Component
export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    // Check if already logged in from previous session
    const storedUser = localStorage.getItem("adminUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Login Function
  const login = (username: string, password: string): boolean => {
    console.log("login called")
    // Trim inputs to remove any accidental whitespace
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    console.log("Login attempt:", {
      inputUsername: trimmedUsername,
      inputPassword: trimmedPassword,
    });

    // Log stored credentials for debugging
    console.log("Stored Credentials:", ADMIN_CREDENTIALS);

    // Check credentials
    const isValidAdmin = ADMIN_CREDENTIALS.some(
      (cred) =>
        cred.username === trimmedUsername && cred.password === trimmedPassword,
    );

    console.log("Login validation result:", isValidAdmin);

    if (isValidAdmin) {
      const adminUser: AdminUser = {
        username: trimmedUsername,
        role: "admin",
      };

      // Store in localStorage
      localStorage.setItem("adminUser", JSON.stringify(adminUser));
      setUser(adminUser);

      console.log("User logged in successfully:", adminUser);
      return true;
    }

    console.log("Login failed");
    return false;
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("adminUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom Hook for Admin Authentication
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
