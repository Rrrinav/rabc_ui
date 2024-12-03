import { Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import { UserProvider } from "./contexts/userContext";
import { RoleProvider } from "./contexts/roleContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <div className="flex flex-row gap-0 justify-between">
      <AdminAuthProvider>
        <Layout />
      </AdminAuthProvider>
    </div>
  );
}

export default App;
