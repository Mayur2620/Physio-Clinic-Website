import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { defaultSiteContent } from "../db/defaultSiteContent.js";

export const siteContentRouter = Router();

const COLUMNS = [
  "clinic_name",
  "clinic_description",
  "hero_title",
  "hero_description",
  "about_title",
  "about_description",
  "about_page_title",
  "about_page_description",
  "services_page_title",
  "services_page_description",
  "contact_heading",
  "contact_description",
  "phone",
  "email",
  "address",
  "whatsapp_text",
  "trust_customers",
  "trust_visitors",
  "quick_stats",
  "features",
  "services",
  "doctors",
];

const toCamel = (snake) => snake.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const rowToContent = (row) => {
  const content = {};
  for (const column of COLUMNS) {
    const key = toCamel(column);
    const value = row[column];
    if (["quick_stats", "features", "services", "doctors"].includes(column)) {
      content[key] = typeof value === "string" ? JSON.parse(value) : value;
    } else {
      content[key] = value;
    }
  }
  return content;
};

siteContentRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM site_content WHERE id = 1");
    if (rows.length === 0) {
      return res.status(404).json({ error: "Site content has not been seeded yet." });
    }
    res.json(rowToContent(rows[0]));
  })
);

const persistContent = async (content) => {
  const params = {
    clinicName: content.clinicName,
    clinicDescription: content.clinicDescription,
    heroTitle: content.heroTitle,
    heroDescription: content.heroDescription,
    aboutTitle: content.aboutTitle,
    aboutDescription: content.aboutDescription,
    aboutPageTitle: content.aboutPageTitle,
    aboutPageDescription: content.aboutPageDescription,
    servicesPageTitle: content.servicesPageTitle,
    servicesPageDescription: content.servicesPageDescription,
    contactHeading: content.contactHeading,
    contactDescription: content.contactDescription,
    phone: content.phone,
    email: content.email,
    address: content.address,
    whatsappText: content.whatsappText,
    trustCustomers: content.trustCustomers,
    trustVisitors: content.trustVisitors,
    quickStats: JSON.stringify(content.quickStats || []),
    features: JSON.stringify(content.features || []),
    services: JSON.stringify(content.services || []),
    doctors: JSON.stringify(content.doctors || []),
  };

  await pool.query(
    `UPDATE site_content SET
      clinic_name = :clinicName, clinic_description = :clinicDescription,
      hero_title = :heroTitle, hero_description = :heroDescription,
      about_title = :aboutTitle, about_description = :aboutDescription,
      about_page_title = :aboutPageTitle, about_page_description = :aboutPageDescription,
      services_page_title = :servicesPageTitle, services_page_description = :servicesPageDescription,
      contact_heading = :contactHeading, contact_description = :contactDescription,
      phone = :phone, email = :email, address = :address, whatsapp_text = :whatsappText,
      trust_customers = :trustCustomers, trust_visitors = :trustVisitors,
      quick_stats = :quickStats, features = :features, services = :services, doctors = :doctors
    WHERE id = 1`,
    params
  );

  const [rows] = await pool.query("SELECT * FROM site_content WHERE id = 1");
  return rowToContent(rows[0]);
};

siteContentRouter.put(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const updated = await persistContent(req.body || {});
    res.json(updated);
  })
);

siteContentRouter.post(
  "/reset",
  requireAuth,
  asyncHandler(async (req, res) => {
    const updated = await persistContent(defaultSiteContent());
    res.json(updated);
  })
);
