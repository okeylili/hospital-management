import mongoose from "mongoose";
import { Billing } from "../models/Billing.js";

export async function listBilling(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const { payment_status, patient_id, from, to } = req.query;
    const filter = {};
    if (payment_status) filter.payment_status = payment_status;
    if (patient_id && mongoose.isValidObjectId(patient_id)) filter.patient_id = patient_id;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const [items, total] = await Promise.all([
      Billing.find(filter)
        .populate("patient_id", "name contact")
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Billing.countDocuments(filter),
    ]);
    res.json({ data: items, total, page, limit, pages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function createBilling(req, res) {
  try {
    const bill = await Billing.create(req.body);
    const populated = await Billing.findById(bill._id).populate("patient_id", "name contact");
    res.status(201).json(populated);
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(e.errors).map((x) => x.message).join(", ") });
    }
    res.status(500).json({ message: e.message });
  }
}
