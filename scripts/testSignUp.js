import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

async function testSignup() {
  const newUser = {
    username: "shittttt",
    email: "heyyyyyyyyy@test.com",
    password: "123",
    bio: "I love justice",
  };

  try {
    const client = await clientPromise;
    const db = client.db("deathNote");
    const users = db.collection("users");

    const existingUser = await users.findOne({
      $or: [{ email: newUser.email }, { username: newUser.username }],
    });

    if (existingUser) {
      console.log("Signup failed: user already exists");
      return;
    }

    const newUserId = uuidv4();

    const result = await users.insertOne({
      id: newUserId,     
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      bio: newUser.bio,
      blogs: [],
      img: "",            
    });

    console.log("Signup successful!");
    console.log({
      _id: result.insertedId,  // MongoDB _id
      id: newUserId,           // UUID
      username: newUser.username,
      email: newUser.email,
      bio: newUser.bio,
      blogs: [],
      img: "",
    });

    await client.close();
  } catch (err) {
    console.error("Error during signup test:", err);
  }
}

testSignup();
