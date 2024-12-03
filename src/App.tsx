import { Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import { UserProvider } from "./contexts/userContext";
import { RoleProvider } from "./contexts/roleContext";

function App() {
  return (
    <div className="flex flex-row gap-0 justify-between">
      <Layout />
      <UserProvider>
        <RoleProvider>
          <main className="flex-grow">
            <Navbar />
            <Outlet />
          </main>
        </RoleProvider>
      </UserProvider>
    </div>
  );
}

export default App;
