import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(express.json());

// 🔗 MongoDB Connection
const client = new MongoClient("mongodb://127.0.0.1:27017");
let db;

async function connectDB() {
  await client.connect();
  db = client.db("hospital"); // database name
  console.log("Connected to MongoDB");
}
connectDB();

// =======================
// 📌 CREATE Doctor
// =======================
app.post("/doctors", async (req, res) => {
  try {
    const result = await db.collection("doctors").insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 📌 GET Doctors (with filtering + pagination)
// =======================
app.get("/doctors", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { specialization: { $regex: search, $options: "i" } },
        ],
      };
    }

    const doctors = await db
      .collection("doctors")
      .find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection("doctors").countDocuments(filter);

    res.json({
      data: doctors,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 📌 UPDATE Doctor
// =======================
app.put("/doctors/:id", async (req, res) => {
  try {
    const result = await db.collection("doctors").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 📌 DELETE Doctor
// =======================
app.delete("/doctors/:id", async (req, res) => {
  try {
    const result = await db
      .collection("doctors")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
