// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Planner from "./pages/Planner";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { token } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/planner"
            element={token ? <Planner /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/planner" replace />}
          />
          <Route
            path="/register"
            element={!token ? <Register /> : <Navigate to="/planner" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
