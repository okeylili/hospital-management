import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(express.json());

// 🔗 Connect MongoDB
const client = new MongoClient("mongodb://127.0.0.1:27017");
let db;

async function connectDB() {
  await client.connect();
  db = client.db("hospital");
  console.log("MongoDB Connected");
}
connectDB();

// =======================
// 📌 CREATE Patient
// =======================
app.post("/patients", async (req, res) => {
  try {
    const result = await db.collection("patients").insertOne(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// 📌 GET Patients (filter + pagination)
// =======================
app.get("/patients", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { "contact.phone": { $regex: search, $options: "i" } },
          { "contact.email": { $regex: search, $options: "i" } },
        ],
      };
    }

    const patients = await db
      .collection("patients")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection("patients").countDocuments(filter);

    res.json({
      data: patients,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// 📌 UPDATE Patient
// =======================
app.put("/patients/:id", async (req, res) => {
  try {
    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
// 📌 DELETE Patient
// =======================
app.delete("/patients/:id", async (req, res) => {
  try {
    const result = await db
      .collection("patients")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =======================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
