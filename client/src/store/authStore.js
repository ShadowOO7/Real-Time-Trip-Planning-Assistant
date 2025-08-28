// frontend/src/store/authStore.js
import { create } from "zustand";
import api from "../api/http";

// Helper to save auth state to localStorage
const saveAuthToStorage = (token, user) => {
  localStorage.setItem("auth", JSON.stringify({ token, user }));
};

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,

  // --- Login: API call and state update ---
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data && response.data.token) {
        const { token, user } = response.data;
        set({ token, user });
        saveAuthToStorage(token, user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  // --- Register: API call and state update ---
  register: async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      if (response.data && response.data.token) {
        const { token, user } = response.data;
        set({ token, user });
        saveAuthToStorage(token, user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  },

  // --- Load auth from storage ---
  loadAuth: () => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const { token, user } = JSON.parse(saved);
      if (token && user) {
        set({ token, user });
      }
    }
  },

  // --- Logout handler ---
  logout: async () => {
    try {
      const token = get().token;
      if (token) {
        await api.post("/auth/logout"); // ✅ calls backend logout
      }
    } catch (err) {
      console.warn("Logout API call failed:", err.message);
    }
    // Clear client state always
    set({ token: null, user: null });
    localStorage.removeItem("auth");
  },
}));

// Initialize auth state from localStorage on app startup
useAuthStore.getState().loadAuth();
