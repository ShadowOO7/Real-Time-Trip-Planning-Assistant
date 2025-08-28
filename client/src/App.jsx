// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles/app.css";
import "./styles/animations.css";
import "./styles/utilities.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Planner from "./pages/Planner";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { token } = useAuthStore();

  return (
    <>
      {/* Navbar always visible */}
      <Navbar />

      {/* Add padding-top = navbar height */}
      <main className="app-container">
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
    </>
  );
}
