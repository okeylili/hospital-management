import { Doctor } from "../models/Doctor.js";

export async function doctorOptionsForRegister(_req, res) {
  try {
    const data = await Doctor.find().select("name specialization").sort({ name: 1 }).lean();
    res.json({ data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
