# 🏥 Hospital Management Analytics System

A full-stack healthcare management and analytics platform built with a modern web stack:

* **Frontend:** React (Vite) + Tailwind CSS
* **Backend:** Node.js + Express (MVC architecture)
* **Database:** MongoDB Atlas
* **Auth:** JWT + Role-Based Access Control (Admin / Doctor)

---

# 🚀 Features

## 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access:

  * **Admin:** Full system control
  * **Doctor:** Restricted, personalized access

## 🧾 Core Modules

* Patients (CRUD — Admin only for write)
* Doctors (Admin managed)
* Appointments (Doctor-specific visibility)
* Billing system

## 📊 Analytics (MongoDB Aggregation)

* Disease trends
* Peak hospital hours
* Revenue insights
* Doctor performance metrics

---

# 📁 Project Structure

```
hospital-management/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/auth.js
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/seed.js
│   │   └── server.js
│   ├── .env (ignored)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   └── pages/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Setup Instructions

## 🔧 Prerequisites

* Node.js (v18+)
* MongoDB Atlas account (or local MongoDB)

---

## 🛠️ Backend Setup

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

⚠️ Never commit `.env` to version control.

### Run Backend

```bash
npm run seed   # optional (creates demo data)
npm run dev    # start server
```

Server runs on:
👉 [http://localhost:5000](http://localhost:5000)

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on:
👉 [http://localhost:5173](http://localhost:5173)

---

# 🔗 API Overview

| Module       | Method   | Endpoint           |
| ------------ | -------- | ------------------ |
| Auth         | POST     | /api/auth/register |
| Auth         | POST     | /api/auth/login    |
| Doctors      | GET      | /api/doctors       |
| Patients     | CRUD     | /api/patients      |
| Appointments | GET/POST | /api/appointments  |
| Billing      | GET/POST | /api/billing       |
| Analytics    | GET      | /api/analytics/*   |

---

# 👤 Demo Credentials (after seeding)

| Role   | Email                                             | Password  |
| ------ | ------------------------------------------------- | --------- |
| Admin  | [admin@hospital.com](mailto:admin@hospital.com)   | admin123  |
| Doctor | [doctor@hospital.com](mailto:doctor@hospital.com) | doctor123 |

---

# 🧠 Database Design Highlights

## 🔹 Data Modeling

* Embedded documents: `medical_history`
* Referenced collections: patients, doctors, appointments

## 🔹 Indexing

* Optimized queries using indexes on:

  * `patient_id`
  * `doctor_id`
  * `date`

## 🔹 Aggregation Pipelines

* Advanced analytics using MongoDB aggregation framework

---

# 🔐 Security Best Practices

* `.env` is excluded via `.gitignore`
* No hardcoded credentials
* Use strong JWT secrets
* Rotate MongoDB credentials if exposed

---

# 🌟 Key Highlights

* Clean MVC backend architecture
* Scalable MongoDB schema design
* Real-world analytics implementation
* Production-ready structure

---

# 📌 Future Improvements

* Add patient dashboard UI
* Implement role-based UI rendering
* Add unit & integration tests
* Dockerize application

---

# 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

# 📄 License

This project is for educational/demo purposes.
