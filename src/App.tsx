import { Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex flex-row gap-0 justify-between">
      <Layout />
      <main className="flex-grow">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
