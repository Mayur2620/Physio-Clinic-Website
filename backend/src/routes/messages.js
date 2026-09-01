import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { rowToCamel } from "../utils/camelCase.js";

export const messagesRouter = Router();

messagesRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    res.json(rows.map(rowToCamel));
  })
);

messagesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, contact, subject, message } = req.body || {};

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required." });
    }

    const id = randomUUID();
    await pool.query(
      `INSERT INTO messages (id, name, contact, subject, message, status)
       VALUES (:id, :name, :contact, :subject, :message, 'Unread')`,
      { id, name, contact: contact || null, subject: subject || null, message }
    );

    const [rows] = await pool.query("SELECT * FROM messages WHERE id = :id", { id });
    res.status(201).json(rowToCamel(rows[0]));
  })
);

messagesRouter.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body || {};
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    await pool.query("UPDATE messages SET status = :status WHERE id = :id", {
      status,
      id: req.params.id,
    });

    const [rows] = await pool.query("SELECT * FROM messages WHERE id = :id", {
      id: req.params.id,
    });
    if (rows.length === 0) {
      return res.status(404).json({ error: "Message not found." });
    }
    res.json(rowToCamel(rows[0]));
  })
);

messagesRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM messages WHERE id = :id", { id: req.params.id });
    res.status(204).end();
  })
);
