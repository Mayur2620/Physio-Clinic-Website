import twilio from "twilio";
import { pool } from "../db/pool.js";

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SMS_FROM,
  TWILIO_SMS_TEMPLATE,
  TWILIO_CLINICIAN_NAME,
  TWILIO_WHATSAPP_FROM,
} = process.env;

const isConfigured = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN);

const client = isConfigured ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;

const formatAppointmentDate = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

const STATUS_MESSAGES = {
  Confirmed: (clinic, appointment) => {
    const appointmentDate = formatAppointmentDate(appointment.preferredDate);
    return (
      `Dear ${appointment.name}, your appointment with ${clinic.clinicianName} at ` +
      `${clinic.name} is confirmed${appointmentDate ? ` for ${appointmentDate}` : ""}. ` +
      "Please arrive 10 minutes early. " +
      `For any changes, contact us at ${clinic.phone}. Thank you!`
    );
  },
  Cancelled: (clinic, appointment) =>
    `Dear ${appointment.name}, your appointment with ${clinic.clinicianName} at ` +
    `${clinic.name} has been cancelled. Please contact us at ${clinic.phone} ` +
    "if you'd like to reschedule.",
};

// Normalizes a free-text phone number to E.164, assuming India (+91) when no
// country code is present. Returns null if it doesn't look like a real number.
export const toE164 = (rawPhone) => {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    return digits.length >= 11 ? digits : null;
  }
  const stripped = digits.replace(/^0+/, "");
  if (stripped.length === 10) {
    return `+91${stripped}`;
  }
  if (stripped.length > 10) {
    return `+${stripped}`;
  }
  return null;
};

export const notifyAppointmentStatus = async (appointment) => {
  const template = STATUS_MESSAGES[appointment.status];
  if (!template) {
    return { attempted: false };
  }

  if (!isConfigured) {
    console.warn(
      "[notify] Twilio is not configured (missing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN) — skipping SMS/WhatsApp notification."
    );
    return { attempted: false, reason: "not_configured" };
  }

  const phone = toE164(appointment.phone);
  if (!phone) {
    console.warn(`[notify] Could not parse a valid phone number from "${appointment.phone}" — skipping.`);
    return { attempted: false, reason: "invalid_phone" };
  }

  const [rows] = await pool.query("SELECT clinic_name, phone FROM site_content WHERE id = 1");
  const clinic = {
    name: rows[0]?.clinic_name || "ReviveCare Physiotherapy Clinic",
    phone: rows[0]?.phone || "the clinic",
    clinicianName: TWILIO_CLINICIAN_NAME || "your physiotherapist",
  };
  const body = template(clinic, appointment);
  // Twilio trial accounts accept only the predefined template names as an SMS
  // body. Set TWILIO_SMS_TEMPLATE=sms_appointment_reminders for trial use;
  // leave it blank on a paid account to send the personalized text above.
  const smsBody = TWILIO_SMS_TEMPLATE || body;

  const results = { attempted: true, sms: null, whatsapp: null };

  if (TWILIO_SMS_FROM) {
    try {
      await client.messages.create({ to: phone, from: TWILIO_SMS_FROM, body: smsBody });
      results.sms = "sent";
    } catch (error) {
      console.error("[notify] SMS send failed:", error.message);
      results.sms = "failed";
      results.smsError = error.message;
    }
  }

  if (TWILIO_WHATSAPP_FROM) {
    try {
      const whatsappFrom = TWILIO_WHATSAPP_FROM.startsWith("whatsapp:")
        ? TWILIO_WHATSAPP_FROM
        : `whatsapp:${TWILIO_WHATSAPP_FROM}`;
      await client.messages.create({
        to: `whatsapp:${phone}`,
        from: whatsappFrom,
        body,
      });
      results.whatsapp = "sent";
    } catch (error) {
      console.error("[notify] WhatsApp send failed:", error.message);
      results.whatsapp = "failed";
      results.whatsappError = error.message;
    }
  }

  return results;
};
