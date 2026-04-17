import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(express.json());

// 🔗 DB Connection
const client = new MongoClient("mongodb://127.0.0.1:27017");
let db;

async function connectDB() {
  await client.connect();
  db = client.db("hospital");
  console.log("MongoDB Connected");
}
connectDB();

// =======================
// 📌 GET Appointments (filter + pagination)
// =======================
app.get("/appointments", async (req, res) => {
  try {
    const { status, doctor_id, patient_id, from, to, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (status) filter.status = status;

    if (patient_id) filter.patient_id = new ObjectId(patient_id);
    if (doctor_id) filter.doctor_id = new ObjectId(doctor_id);

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    // 🔒 Doctor restriction
    if (req.user?.role === "doctor" && req.user?.doctor_id) {
      filter.doctor_id = new ObjectId(req.user.doctor_id);
    }

    const appointments = await db
      .collection("appointments")
      .find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection("appointments").countDocuments(filter);

    res.json({
      data: appointments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// 📌 CREATE Appointment
// =======================
app.post("/appointments", async (req, res) => {
  try {
    const body = req.body;

    // 🔒 Doctor restriction
    if (req.user?.role === "doctor" && req.user?.doctor_id) {
      if (body.doctor_id !== req.user.doctor_id) {
        return res.status(403).json({
          message: "Doctors can only book for their own profile",
        });
      }
    }

    // Convert IDs to ObjectId
    body.patient_id = new ObjectId(body.patient_id);
    body.doctor_id = new ObjectId(body.doctor_id);
    body.date = new Date(body.date);

    const result = await db.collection("appointments").insertOne(body);

    const newAppointment = await db
      .collection("appointments")
      .findOne({ _id: result.insertedId });

    res.status(201).json(newAppointment);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
