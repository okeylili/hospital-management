import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";
import { Appointment } from "../models/Appointment.js";
import { Billing } from "../models/Billing.js";

async function run() {
  await connectDB();
  const existing = await User.findOne({ email: "admin@hospital.com" });
  if (existing) {
    console.log("Seed skipped: admin@hospital.com already exists. Delete users collection or change email to re-seed.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const doctors = await Doctor.insertMany([
    {
      name: "Dr. Ananya Sharma",
      specialization: "Cardiology",
      available_slots: ["09:00", "10:00", "11:00", "14:00"],
    },
    {
      name: "Dr. Rahul Verma",
      specialization: "Orthopedics",
      available_slots: ["08:00", "09:30", "12:00", "16:00"],
    },
    {
      name: "Dr. Priya Nair",
      specialization: "General Medicine",
      available_slots: ["10:00", "11:00", "15:00", "17:00"],
    },
  ]);

  const patients = await Patient.insertMany([
    {
      name: "Vikram Singh",
      age: 42,
      gender: "male",
      contact: { phone: "9876500001", email: "vikram@example.com" },
      medical_history: [
        { condition: "Hypertension", diagnosed_at: new Date("2023-01-15"), notes: "On medication" },
        { condition: "Type 2 Diabetes", diagnosed_at: new Date("2024-06-01"), notes: "" },
      ],
    },
    {
      name: "Sneha Patil",
      age: 28,
      gender: "female",
      contact: { phone: "9876500002", email: "sneha@example.com" },
      medical_history: [{ condition: "Asthma", diagnosed_at: new Date("2022-03-10"), notes: "Mild" }],
    },
    {
      name: "Arjun Mehta",
      age: 55,
      gender: "male",
      contact: { phone: "9876500003", email: "arjun@example.com" },
      medical_history: [
        { condition: "Hypertension", diagnosed_at: new Date("2021-11-20"), notes: "" },
        { condition: "Osteoarthritis", diagnosed_at: new Date("2025-01-05"), notes: "Knee" },
      ],
    },
  ]);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const appointments = await Appointment.insertMany([
    {
      patient_id: patients[0]._id,
      doctor_id: doctors[0]._id,
      date: new Date(y, m, 5, 10, 0),
      status: "completed",
      diagnosis: "Hypertension",
    },
    {
      patient_id: patients[1]._id,
      doctor_id: doctors[2]._id,
      date: new Date(y, m, 6, 14, 30),
      status: "completed",
      diagnosis: "Asthma",
    },
    {
      patient_id: patients[2]._id,
      doctor_id: doctors[1]._id,
      date: new Date(y, m, 7, 9, 0),
      status: "completed",
      diagnosis: "Osteoarthritis",
    },
    {
      patient_id: patients[0]._id,
      doctor_id: doctors[2]._id,
      date: new Date(y, m, 8, 11, 0),
      status: "scheduled",
      diagnosis: "",
    },
    {
      patient_id: patients[1]._id,
      doctor_id: doctors[0]._id,
      date: new Date(y, m, 10, 16, 0),
      status: "completed",
      diagnosis: "Hypertension",
    },
  ]);

  await Billing.insertMany([
    {
      patient_id: patients[0]._id,
      amount: 4500,
      payment_status: "paid",
      insurance_claimed: true,
      date: new Date(y, m - 1, 20),
    },
    {
      patient_id: patients[1]._id,
      amount: 3200,
      payment_status: "paid",
      insurance_claimed: false,
      date: new Date(y, m - 1, 22),
    },
    {
      patient_id: patients[2]._id,
      amount: 7800,
      payment_status: "partial",
      insurance_claimed: true,
      date: new Date(y, m, 1),
    },
    {
      patient_id: patients[0]._id,
      amount: 2100,
      payment_status: "pending",
      insurance_claimed: false,
      date: new Date(y, m, 3),
    },
  ]);

  const adminHash = await bcrypt.hash("admin123", 10);
  const docHash = await bcrypt.hash("doctor123", 10);

  await User.create([
    {
      email: "admin@hospital.com",
      password: adminHash,
      name: "Hospital Admin",
      role: "admin",
      doctor_id: null,
    },
    {
      email: "doctor@hospital.com",
      password: docHash,
      name: doctors[0].name,
      role: "doctor",
      doctor_id: doctors[0]._id,
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin: admin@hospital.com / admin123");
  console.log("Doctor: doctor@hospital.com / doctor123 (linked to first doctor)");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
