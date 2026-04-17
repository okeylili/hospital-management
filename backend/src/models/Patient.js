import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function run() {
  await client.connect();
  const db = client.db("hospital");
  const collection = db.collection("patients");

  async function createPatient(data) {
    const allowedGender = ["male", "female", "other"];

    if (!data.name) throw new Error("name is required");
    if (data.age === undefined) throw new Error("age is required");
    if (data.age < 0 || data.age > 150) throw new Error("invalid age");
    if (!data.gender || !allowedGender.includes(data.gender)) throw new Error("invalid gender");
    if (!data.contact || !data.contact.phone) throw new Error("phone is required");

    const doc = {
      name: data.name.trim(),
      age: data.age,
      gender: data.gender,
      contact: {
        phone: data.contact.phone.trim(),
        email: data.contact.email || ""
      },
      medical_history: (data.medical_history || []).map(item => ({
        _id: new ObjectId(),
        condition: item.condition,
        diagnosed_at: item.diagnosed_at ? new Date(item.diagnosed_at) : null,
        notes: item.notes || ""
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await collection.insertOne(doc);
  }

  async function getPatients(filter = {}) {
    return await collection.find(filter).toArray();
  }

  async function updatePatient(id, data) {
    data.updatedAt = new Date();
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async function deletePatient(id) {
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }

  await createPatient({
    name: "Rahul",
    age: 22,
    gender: "male",
    contact: {
      phone: "9876543210",
      email: "rahul@gmail.com"
    },
    medical_history: [
      {
        condition: "Fever",
        diagnosed_at: "2026-04-01",
        notes: "Mild"
      }
    ]
  });

  console.log(await getPatients());
}

run();
