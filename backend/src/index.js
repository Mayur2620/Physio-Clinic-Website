import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { siteContentRouter } from "./routes/siteContent.js";
import { appointmentsRouter } from "./routes/appointments.js";
import { messagesRouter } from "./routes/messages.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/site-content", siteContentRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/messages", messagesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Physio Clinic API running on http://localhost:${port}`);
});
