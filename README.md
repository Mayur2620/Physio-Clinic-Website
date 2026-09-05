# Physio Clinic

Two-folder project:

```
pysio-clinic/
├── frontend/   # React + Vite site
└── backend/    # Node + Express + MySQL API
```

## Backend (Node + Express + MySQL)

The site is backed by an API in [backend/](backend). It stores clinic
content, appointment requests, and contact messages in MySQL, and protects
admin writes behind a JWT login.

Setup (first time):

```bash
cd backend
npm install
npm run seed   # creates tables in MySQL and an admin user from .env
npm run dev    # starts the API on http://localhost:4000
```

Configure `backend/.env` (copy from `backend/.env.example`) with your MySQL
credentials and the admin login you want (`ADMIN_USERNAME` / `ADMIN_PASSWORD`,
used only the first time `npm run seed` creates the account).

### Production deployment (Railway)

Deploy `backend/` as a Railway service and add a MySQL service in the same
Railway project. Railway exposes the database values as `MYSQLHOST`,
`MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, and `MYSQLDATABASE`; map them to
the API service's environment variables as follows:

```
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
CLIENT_ORIGIN=https://mayur2620.github.io,https://sparkly-florentine-778ebb.netlify.app
JWT_SECRET=<long-random-secret>
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<strong-admin-password>
```

`CLIENT_ORIGIN` accepts a comma-separated list, so both the GitHub Pages and
Netlify frontends can call the same API. Also add the `TWILIO_*` values there
if SMS notifications are required. Set the Railway service's root directory
to `backend`; its `npm start` command initializes missing tables safely
before starting the API. Once Railway gives you an API URL, add an
environment variable in the Netlify dashboard (Site configuration →
Environment variables):

```
VITE_API_URL=https://your-railway-domain/api
```

then trigger a redeploy (Netlify rebuilds automatically on the next push, or
use "Trigger deploy" in the dashboard) — `VITE_API_URL` is inlined into the
JS bundle at build time, so it only takes effect after a rebuild.

### Appointment SMS/WhatsApp notifications (optional)

When an admin marks an appointment **Confirmed** or **Cancelled** in the admin
panel, the customer is notified by SMS and WhatsApp via
[Twilio](https://www.twilio.com). This is optional — leave the `TWILIO_*`
variables in `backend/.env` blank and the app works normally, it just skips
sending the message (and tells the admin so in the UI).

To enable it:
1. Create a free Twilio account and verify your phone number.
2. From the [Twilio Console](https://console.twilio.com), copy your **Account SID** and **Auth Token**.
3. Buy/claim a Twilio phone number for SMS.
4. Activate the WhatsApp Sandbox (Console → Messaging → Try it out) for testing, or use an approved WhatsApp sender in production. During the sandbox trial, each recipient must first send the given join code to the sandbox number on WhatsApp.
5. Fill in `backend/.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_SMS_FROM=+15551234567
   TWILIO_SMS_TEMPLATE=sms_appointment_reminders
   TWILIO_WHATSAPP_FROM=+14155238886
   ```
   Twilio trial accounts require one of Twilio's predefined SMS template names.
   The value above enables the appointment-reminder template. Remove this line
   after upgrading to a paid account to send the personalized appointment text.
6. Restart the backend.

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev    # starts the site on http://localhost:5173
```

The frontend reads the API URL from `frontend/.env` (`VITE_API_URL`,
defaults to `http://localhost:4000/api`).

Run both together during development: `npm run dev` in `backend/`, and
`npm run dev` in `frontend/`. Visit `/#/admin` and sign in with your admin
credentials to manage content and leads.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
