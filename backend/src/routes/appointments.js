import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { rowToCamel } from "../utils/camelCase.js";
import { notifyAppointmentStatus } from "../services/notify.js";

export const appointmentsRouter = Router();

appointmentsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM appointments ORDER BY created_at DESC");
    res.json(rows.map(rowToCamel));
  })
);

appointmentsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, phone, email, serviceType, preferredDate, message } = req.body || {};

    if (!name || !phone || !email) {
      return res.status(400).json({ error: "Name, phone, and email are required." });
    }

    const id = randomUUID();
    await pool.query(
      `INSERT INTO appointments (id, name, phone, email, service_type, preferred_date, message, status)
       VALUES (:id, :name, :phone, :email, :serviceType, :preferredDate, :message, 'New')`,
      {
        id,
        name,
        phone,
        email,
        serviceType: serviceType || null,
        preferredDate: preferredDate || null,
        message: message || null,
      }
    );

    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = :id", { id });
    res.status(201).json(rowToCamel(rows[0]));
  })
);

appointmentsRouter.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body || {};
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    await pool.query("UPDATE appointments SET status = :status WHERE id = :id", {
      status,
      id: req.params.id,
    });

    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = :id", {
      id: req.params.id,
    });
    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    const appointment = rowToCamel(rows[0]);
    const notification = await notifyAppointmentStatus(appointment).catch((error) => {
      console.error("[notify] Unexpected notification error:", error.message);
      return { attempted: false, reason: "error" };
    });

    res.json({ ...appointment, notification });
  })
);

appointmentsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM appointments WHERE id = :id", { id: req.params.id });
    res.status(204).end();
  })
);
