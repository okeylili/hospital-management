import { Doctor } from "../models/Doctor.js";

export async function listDoctors(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const search = (req.query.search || "").trim();
    const filter = search
      ? {
          $or: [{ name: new RegExp(search, "i") }, { specialization: new RegExp(search, "i") }],
        }
      : {};
    const [items, total] = await Promise.all([
      Doctor.find(filter)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Doctor.countDocuments(filter),
    ]);
    res.json({ data: items, total, page, limit, pages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function createDoctor(req, res) {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(e.errors).map((x) => x.message).join(", ") });
    }
    res.status(500).json({ message: e.message });
  }
}
