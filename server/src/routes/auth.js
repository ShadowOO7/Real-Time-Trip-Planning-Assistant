// server/src/routes/auth.js
import { Router } from "express";
import { register, login, me, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

// Public routes
r.post("/register", register);
r.post("/login", login);

// Protected routes
r.get("/me", requireAuth, me);
r.post("/logout", requireAuth, logout);

export default r;
