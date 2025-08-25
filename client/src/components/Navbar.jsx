// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { token, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left side */}
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-yellow-400 transition">
          Home
        </Link>
        <Link to="/about" className="hover:text-yellow-400 transition">
          About
        </Link>
        {token && (
          <Link to="/planner" className="hover:text-yellow-400 transition">
            Planner
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {!token ? (
          <>
            <Link
              to="/login"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-300">Hi, {user?.name || "Traveler"}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
