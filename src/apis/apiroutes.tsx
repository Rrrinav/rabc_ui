export const API_ROUTES = {
  USERS: "/users",
  USER: (id: string) => `/users/${id}`,
  ROLES: "/roles",
  ROLE: (id: string) => `/roles/${id}`,
  PERMISSIONS: "/permissions",
  PERMISSION: (id: string) => `/permissions/${id}`,
};
