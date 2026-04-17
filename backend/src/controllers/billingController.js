import { MongoClient } from "mongodb";
import promptSync from "prompt-sync";

const prompt = promptSync();

const uri = "YOUR_MONGO_URI";
const client = new MongoClient(uri);

async function run() {
  await client.connect();

  const db = client.db("test");
  const users = db.collection("users");

  // ==================
  // TAKE INPUT
  // ==================
  const name = prompt("Enter name: ");
  const age = parseInt(prompt("Enter age: "));
  const status = prompt("Enter status: ");

  // ==================
  // INSERT ONE
  // ==================
  await users.insertOne({
    name,
    age,
    status,
    createdAt: new Date()
  });

  console.log("Data inserted ✅");

  // ==================
  // FIND
  // ==================
  const result = await users.find({ name }).toArray();
  console.log("Found:", result);

  // ==================
  // UPDATE
  // ==================
  const newAge = parseInt(prompt("Enter new age to update: "));
  await users.updateOne(
    { name },
    { $set: { age: newAge } }
  );

  console.log("Updated ✅");

  // ==================
  // DELETE
  // ==================
  const deleteChoice = prompt("Delete this user? (yes/no): ");
  if (deleteChoice === "yes") {
    await users.deleteOne({ name });
    console.log("Deleted ✅");
  }

  await client.close();
}

run();
