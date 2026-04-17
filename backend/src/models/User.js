import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function run() {
  await client.connect();
  const db = client.db("hospital");
  const collection = db.collection("users");

  await collection.createIndex({ email: 1 }, { unique: true });

  async function createUser(data) {
    const allowedRoles = ["admin", "doctor"];

    if (!data.email) throw new Error("email is required");
    if (!data.password || data.password.length < 6) throw new Error("invalid password");
    if (!data.name) throw new Error("name is required");

    if (!data.role) data.role = "doctor";
    if (!allowedRoles.includes(data.role)) throw new Error("invalid role");

    const doc = {
      email: data.email.toLowerCase().trim(),
      password: data.password,
      name: data.name.trim(),
      role: data.role,
      doctor_id: data.doctor_id ? new ObjectId(data.doctor_id) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await collection.insertOne(doc);
  }

  async function getUsers(filter = {}) {
    return await collection.find(filter, { projection: { password: 0 } }).toArray();
  }

  async function updateUser(id, data) {
    data.updatedAt = new Date();
    if (data.doctor_id) data.doctor_id = new ObjectId(data.doctor_id);
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async function deleteUser(id) {
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }

  await createUser({
    email: "admin@gmail.com",
    password: "123456",
    name: "Admin",
    role: "admin"
  });

  console.log(await getUsers());
}

run();
