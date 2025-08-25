// server/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "http-errors";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// --- Register ---
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) throw createError(400, "email and password required");

    const existing = await User.findOne({ email });
    if (existing) throw createError(409, "email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name || "User", email, passwordHash });

    const token = jwt.sign(
      { uid: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
}

// --- Login ---
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(401, "invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw createError(401, "invalid credentials");

    const token = jwt.sign(
      { uid: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
}

// --- Me (Profile) ---
export async function me(req, res, next) {
  try {
    res.json({ user: { _id: req.user.uid, name: req.user.name, email: req.user.email } });
  } catch (e) {
    next(e);
  }
}

// --- Logout ---
export async function logout(req, res, next) {
  try {
    // With JWT, logout is usually client-side: just delete the token.
    // If you want server-side enforcement, you’d need a token blacklist.
    res.json({ message: "Logged out successfully. Please clear token on client." });
  } catch (e) {
    next(e);
  }
}
