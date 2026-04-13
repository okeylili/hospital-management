import { Patient } from "../models/Patient.js";

export async function listPatients(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = (req.query.search || "").trim();
    const filter = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { "contact.phone": new RegExp(search, "i") },
            { "contact.email": new RegExp(search, "i") },
          ],
        }
      : {};
    const [items, total] = await Promise.all([
      Patient.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Patient.countDocuments(filter),
    ]);
    res.json({ data: items, total, page, limit, pages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function createPatient(req, res) {
  try {
    const body = req.body;
    const patient = await Patient.create(body);
    res.status(201).json(patient);
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(e.errors).map((x) => x.message).join(", ") });
    }
    res.status(500).json({ message: e.message });
  }
}

export async function updatePatient(req, res) {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(e.errors).map((x) => x.message).join(", ") });
    }
    res.status(500).json({ message: e.message });
  }
}

export async function deletePatient(req, res) {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
