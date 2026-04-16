import { Appointment } from "../models/Appointment.js"; 
import { Billing } from "../models/Billing.js";
import { Patient } from "../models/Patient.js";

/** Most common diseases: from appointment diagnosis + patient medical_history conditions */
export async function diseases(req, res) {
  try {
    const fromAppts = await Appointment.aggregate([
      { $match: { diagnosis: { $exists: true, $nin: [null, ""] } } },
      { $group: { _id: { $trim: { input: "$diagnosis" } }, count: { $sum: 1 } } },
      { $match: { _id: { $ne: "" } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { disease: "$_id", count: 1, _id: 0 } },
    ]);
    const fromHistory = await Patient.aggregate([
      { $unwind: "$medical_history" },
      { $match: { "medical_history.condition": { $exists: true, $nin: [null, ""] } } },
      {
        $group: {
          _id: { $trim: { input: "$medical_history.condition" } },
          count: { $sum: 1 },
        },
      },
      { $match: { _id: { $ne: "" } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { disease: "$_id", count: 1, _id: 0 } },
    ]);
    const map = new Map();
    for (const row of [...fromAppts, ...fromHistory]) {
      const key = row.disease.toLowerCase();
      map.set(key, (map.get(key) || 0) + row.count);
    }
    const merged = [...map.entries()]
      .map(([disease, count]) => ({ disease, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
    res.json({ data: merged });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

/** Peak hospital hours by appointment local hour */
export async function peakHours(req, res) {
  try {
    const data = await Appointment.aggregate([
      { $match: { date: { $exists: true } } },
      {
        $project: {
          hour: { $hour: { date: "$date", timezone: "UTC" } },
        },
      },
      { $group: { _id: "$hour", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { hour: "$_id", appointments: "$count", _id: 0 } },
    ]);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

/** Monthly revenue from paid/partial bills */
export async function revenue(req, res) {
  try {
    const data = await Billing.aggregate([
      {
        $match: {
          payment_status: { $in: ["paid", "partial"] },
          amount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: {
            y: { $year: "$date" },
            m: { $month: "$date" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
      {
        $project: {
          year: "$_id.y",
          month: "$_id.m",
          revenue: "$total",
          bills: "$count",
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

/** Doctor performance: completed appointments count + optional revenue via patient bills (simplified: appointment counts) */
export async function doctorPerformance(req, res) {
  try {
    const data = await Appointment.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctor_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $group: {
          _id: "$doctor_id",
          name: { $first: "$doctor.name" },
          specialization: { $first: "$doctor.specialization" },
          totalAppointments: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      { $sort: { completed: -1, totalAppointments: -1 } },
      {
        $project: {
          doctor_id: "$_id",
          name: 1,
          specialization: 1,
          totalAppointments: 1,
          completed: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
