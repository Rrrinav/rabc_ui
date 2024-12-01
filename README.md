# Role-Based Access Control (RBAC) UI

This is an assignment project for front-end internship application at VRV security

## Project Description

I am building a Role-Based Access Control (RBAC) UI that will allow an admin to manage users and roles in a system.
The admin will be able to create, read, update, and delete users and roles.
The admin will also be able to assign roles to users and remove roles from users.

This project uses React, TypeScript, and tailwindcss.

### Setup

```bash
npm install
npm run dev # for development
npm run build # for production
```

### Directory Structure

```text
├──  public
├──  README.md
├── 󱧼 src
│   ├──  apis              // Contains all the mock
│   ├──  App.css
│   ├──  App.tsx
│   ├──  assets            // contains all the assets
│   ├──  components        // contains all the components
│   ├──  contexts          // contains all the contexts
│   ├──  index.css
│   ├──  main.tsx
│   ├──  pages             // contains all the pages
│   ├──  routes.tsx
│   ├──  types             // contains all the types for typescript
│   └──  vite-env.d.ts
├──  eslint.config.js
├──  index.html
├──  package-lock.json
├──  package.json
├──  tailwind.config.js
├──  tsconfig.app.json
├──  tsconfig.json
├──  tsconfig.node.json
└──  vite.config.ts
```

### TODOs

1. **User Management:**
   - [x] Provide a way to view and manage users.
   - [x] Include options to add, edit, or delete users.
   - [x] Enable assigning roles to users and managing their status (e.g., Active/Inactive).
2. - **Role Management:**
   - [X] Create a way to define and edit roles.
- [X] Allow roles to include permissions (e.g., Read, Write, Delete) or custom attributes. 
   //TODO: Custom attributes
3. **Dynamic Permissions:**
   - [ ] Design a method to assign or modify permissions for roles.
   - [X] Display permissions clearly for ease of understanding and modification.
4. **Custom API Simulation (Optional):**
   - [x] Mock API calls for CRUD operations on users and roles.
   - [x] Simulate server responses to validate functionality.
