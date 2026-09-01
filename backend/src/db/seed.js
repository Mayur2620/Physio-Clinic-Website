import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { pool } from "./pool.js";
import { defaultSiteContent } from "./defaultSiteContent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const statements = schema.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
  for (const statement of statements) {
    await pool.query(statement);
  }
  console.log("Schema ensured.");

  const [existing] = await pool.query("SELECT id FROM site_content WHERE id = 1");
  if (existing.length === 0) {
    const c = defaultSiteContent();
    await pool.query(
      `INSERT INTO site_content (
        id, clinic_name, clinic_description, hero_title, hero_description,
        about_title, about_description, about_page_title, about_page_description,
        services_page_title, services_page_description, contact_heading, contact_description,
        phone, email, address, whatsapp_text, trust_customers, trust_visitors,
        quick_stats, features, services, doctors
      ) VALUES (
        1, :clinicName, :clinicDescription, :heroTitle, :heroDescription,
        :aboutTitle, :aboutDescription, :aboutPageTitle, :aboutPageDescription,
        :servicesPageTitle, :servicesPageDescription, :contactHeading, :contactDescription,
        :phone, :email, :address, :whatsappText, :trustCustomers, :trustVisitors,
        :quickStats, :features, :services, :doctors
      )`,
      {
        ...c,
        quickStats: JSON.stringify(c.quickStats),
        features: JSON.stringify(c.features),
        services: JSON.stringify(c.services),
        doctors: JSON.stringify(c.doctors),
      }
    );
    console.log("Default site content inserted.");
  } else {
    console.log("Site content already present, skipping seed.");
  }

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe_2026!";
  const [adminExisting] = await pool.query("SELECT id FROM admin_users WHERE username = :username", {
    username: adminUsername,
  });
  if (adminExisting.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      "INSERT INTO admin_users (username, password_hash) VALUES (:username, :passwordHash)",
      { username: adminUsername, passwordHash }
    );
    console.log(`Admin user "${adminUsername}" created.`);
  } else {
    console.log(`Admin user "${adminUsername}" already exists, skipping.`);
  }

  await pool.end();
}

run().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
