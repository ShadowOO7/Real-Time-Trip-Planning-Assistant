// frontend/src/store/authStore.js
import { create } from "zustand";
import api from "../api/http";

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,

  // --- Login handler ---
  login: (token, user) => {
    set({ token, user });
    localStorage.setItem("auth", JSON.stringify({ token, user }));
  },

  // --- Load auth from storage ---
  loadAuth: () => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const { token, user } = JSON.parse(saved);
      set({ token, user });
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
