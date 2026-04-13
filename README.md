# Hospital Management Analytics System

Full-stack hospital demo: **React (Vite) + Tailwind + Express + MongoDB Atlas** with MVC on the backend, JWT auth, role-based access (admin / doctor), CRUD wired to MongoDB, and analytics via aggregation pipelines.

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB if you change `MONGODB_URI`)

### Atlas checklist

1. In Atlas → **Network Access**, add your current IP (or `0.0.0.0/0` for development only).
2. Ensure the database user and password in your connection string are correct.
3. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and `JWT_SECRET`.

The project expects `MONGODB_URI` in `backend/.env` (already filled for your class cluster if you use the provided file).

## Folder structure

```
hospital-management/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # mongoose.connect, connection events
│   │   ├── controllers/          # MVC controllers
│   │   ├── middleware/auth.js    # JWT + admin guard
│   │   ├── models/               # Mongoose schemas, indexes, validation
│   │   ├── routes/
│   │   ├── seed/seed.js          # Sample data (run once)
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/client.js         # Axios + Bearer token
│   │   ├── components/         # Layout + shadcn-style UI
│   │   ├── context/AuthContext.jsx
│   │   └── pages/
│   └── package.json
└── README.md
```

## API summary

| Area        | Method | Path | Notes |
|------------|--------|------|--------|
| Auth       | POST   | `/api/auth/register` | Admin or doctor (doctor needs `doctor_id`) |
| Auth       | POST   | `/api/auth/login` | Returns JWT |
| Auth       | GET    | `/api/auth/doctor-options` | Public list for registration dropdown |
| Patients   | CRUD   | `/api/patients` | Write: **admin only** |
| Doctors    | GET/POST | `/api/doctors` | POST: **admin only** |
| Appointments | GET/POST | `/api/appointments` | Doctors only see their own rows |
| Billing    | GET/POST | `/api/billing` | POST: **admin only** |
| Analytics  | GET    | `/api/analytics/diseases`, `peak-hours`, `revenue`, `doctor-performance` | Authenticated |

## Run locally

**1. Backend**

```bash
cd backend
npm install
npm run seed    # optional, once — creates demo users and data
npm run dev     # or npm start
```

Server: `http://localhost:5000` (or `PORT` from `.env`).

**2. Frontend**

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`. Vite proxies `/api` → `http://localhost:5000`.

## Demo logins (after seed)

- **Admin:** `admin@hospital.com` / `admin123` — full CRUD, billing, doctors.
- **Doctor:** `doctor@hospital.com` / `doctor123` — linked to the first seeded doctor; appointments filtered to that doctor; cannot mutate patients/doctors/billing writes.

## MongoDB features implemented

- **Embedded:** `medical_history` on patients.
- **References:** `patient_id` / `doctor_id` on appointments; `patient_id` on billing.
- **Indexes:** `patient_id`, `doctor_id`, `date` on appointments; `patient_id`, `date` on billing.
- **Aggregations:** diseases (diagnoses + history), peak hours, monthly revenue, doctor performance.
- **Validation:** required fields and enums via Mongoose.

## Security note

Do not commit real credentials. Keep `backend/.env` out of git (see `backend/.gitignore`). If this connection string was shared publicly, rotate the Atlas user password and restrict IP access.
