import React, { useState } from "react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(username, password);

    if (success) {
      navigate("/");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-primary-bg-1"
      style={{
        background: "linear-gradient(135deg, #06141B 40%, #11212D 100%)",
      }}
    >
      <div className="backdrop-blur-lg bg-glass shadow-xl rounded-lg p-8 max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-fg-2 mb-4">
            Welcome Back, Admin
          </h1>
          <p className="text-primary-fg-1 text-sm">
            Please sign in to continue.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 rounded-md border-none bg-sec-bg-1 text-color-text placeholder-primary-fg-1 focus:ring-2 focus:ring-primary-fg-2"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-md border-none bg-sec-bg-1 text-color-text placeholder-primary-fg-1 focus:ring-2 focus:ring-primary-fg-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-center text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-lg font-medium text-color-text bg-gradient-to-r from-sec-bg-1 to-sec-bg-2 hover:from-sec-bg-2 hover:to-primary-bg-2 focus:ring-4 focus:ring-sec-bg-2 focus:outline-none shadow-md transition-all duration-300"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-primary-fg-1 text-xs">
            Need help? Contact{" "}
            <span className="text-primary-fg-2">support</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
