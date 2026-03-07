const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function run() {
    await client.connect();

    const db = client.db("studentDB");
    const collection = db.collection("students");

    // CREATE
    await collection.insertOne({ name: "Ali", age: 22 });

    // READ
    const data = await collection.find().toArray();
    console.log(data);

    // UPDATE
    await collection.updateOne({ name: "Ali" }, { $set: { age: 23 } });

    // DELETE
    await collection.deleteOne({ name: "Ali" });

    client.close();
}

run();