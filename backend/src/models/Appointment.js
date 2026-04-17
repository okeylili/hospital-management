import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function run() {
  await client.connect();
  const db = client.db("hospital");
  const collection = db.collection("appointments");

  await collection.createIndex({ patient_id: 1 });
  await collection.createIndex({ doctor_id: 1 });
  await collection.createIndex({ date: 1 });

  async function createAppointment(data) {
    const allowedStatus = ["scheduled", "completed", "cancelled", "no_show"];

    if (!data.patient_id) throw new Error("patient_id is required");
    if (!data.doctor_id) throw new Error("doctor_id is required");
    if (!data.date) throw new Error("date is required");

    if (!data.status) data.status = "scheduled";
    if (!allowedStatus.includes(data.status)) throw new Error("Invalid status");

    const doc = {
      patient_id: new ObjectId(data.patient_id),
      doctor_id: new ObjectId(data.doctor_id),
      date: new Date(data.date),
      status: data.status,
      diagnosis: data.diagnosis || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await collection.insertOne(doc);
  }

  async function getAppointments(filter = {}) {
    return await collection.find(filter).toArray();
  }

  async function updateAppointment(id, data) {
    data.updatedAt = new Date();
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async function deleteAppointment(id) {
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }

  await createAppointment({
    patient_id: "6620f1abc123456789abcd12",
    doctor_id: "6620f1abc123456789abcd34",
    date: "2026-04-20T10:00:00Z",
    status: "scheduled",
    diagnosis: "Fever"
  });

  console.log(await getAppointments());
}

run();
