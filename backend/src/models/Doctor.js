import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function run() {
  await client.connect();
  const db = client.db("hospital");
  const collection = db.collection("doctors");

  async function createDoctor(data) {
    if (!data.name) throw new Error("name is required");
    if (!data.specialization) throw new Error("specialization is required");
    if (!Array.isArray(data.available_slots) || data.available_slots.length === 0) {
      throw new Error("available_slots must be a non-empty array");
    }

    const doc = {
      name: data.name.trim(),
      specialization: data.specialization.trim(),
      available_slots: data.available_slots,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await collection.insertOne(doc);
  }

  async function getDoctors(filter = {}) {
    return await collection.find(filter).toArray();
  }

  async function updateDoctor(id, data) {
    data.updatedAt = new Date();
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async function deleteDoctor(id) {
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }

  await createDoctor({
    name: "Dr. Sharma",
    specialization: "Cardiology",
    available_slots: ["10:00", "11:00"]
  });

  console.log(await getDoctors());
}

run();
