import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function run() {
  await client.connect();
  const db = client.db("hospital");
  const collection = db.collection("billing");

  await collection.createIndex({ patient_id: 1 });
  await collection.createIndex({ date: 1 });

  async function createBilling(data) {
    const allowedStatus = ["pending", "paid", "partial", "refunded"];

    if (!data.patient_id) throw new Error("patient_id is required");
    if (data.amount === undefined) throw new Error("amount is required");
    if (data.amount < 0) throw new Error("amount cannot be negative");
    if (!data.date) throw new Error("date is required");

    if (!data.payment_status) data.payment_status = "pending";
    if (!allowedStatus.includes(data.payment_status)) throw new Error("invalid payment_status");

    if (data.insurance_claimed === undefined) data.insurance_claimed = false;

    const doc = {
      patient_id: new ObjectId(data.patient_id),
      amount: data.amount,
      payment_status: data.payment_status,
      insurance_claimed: data.insurance_claimed,
      date: new Date(data.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await collection.insertOne(doc);
  }

  async function getBilling(filter = {}) {
    return await collection.find(filter).toArray();
  }

  async function updateBilling(id, data) {
    data.updatedAt = new Date();
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async function deleteBilling(id) {
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }

  await createBilling({
    patient_id: "6620f1abc123456789abcd12",
    amount: 500,
    payment_status: "paid",
    insurance_claimed: false,
    date: "2026-04-17T10:00:00Z"
  });

  console.log(await getBilling());
}

run();
