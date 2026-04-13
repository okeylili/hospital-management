import mongoose from "mongoose";
import { Appointment } from "../models/Appointment.js";

export async function listAppointments(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const { status, doctor_id, patient_id, from, to } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (patient_id && mongoose.isValidObjectId(patient_id)) filter.patient_id = patient_id;
    if (doctor_id && mongoose.isValidObjectId(doctor_id)) filter.doctor_id = doctor_id;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (req.user.role === "doctor" && req.user.doctor_id) {
      filter.doctor_id = new mongoose.Types.ObjectId(req.user.doctor_id);
    }
    const [items, total] = await Promise.all([
      Appointment.find(filter)
        .populate("patient_id", "name age gender contact")
        .populate("doctor_id", "name specialization")
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);
    res.json({ data: items, total, page, limit, pages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function createAppointment(req, res) {
  try {
    if (req.user.role === "doctor" && req.user.doctor_id) {
      const did = req.body.doctor_id?.toString();
      if (did !== req.user.doctor_id.toString()) {
        return res.status(403).json({ message: "Doctors can only book for their own profile" });
      }
    }
    const appt = await Appointment.create(req.body);
    const populated = await Appointment.findById(appt._id)
      .populate("patient_id", "name age gender contact")
      .populate("doctor_id", "name specialization");
    res.status(201).json(populated);
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(e.errors).map((x) => x.message).join(", ") });
    }
    res.status(500).json({ message: e.message });
  }
}
