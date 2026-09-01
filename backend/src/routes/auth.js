import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const [rows] = await pool.query("SELECT * FROM admin_users WHERE username = :username", {
      username,
    });
    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    });

    res.json({ token, username: admin.username });
  })
);
