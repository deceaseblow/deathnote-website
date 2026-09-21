import db from "../../../lib/firebase.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { username, email, password, bio } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const usersRef = db.collection("users");

    // Check if email already exists
    const emailSnapshot = await usersRef
      .where("email", "==", email)
      .limit(1)
      .get();

    // Check if username already exists
    const usernameSnapshot = await usersRef
      .where("username", "==", username)
      .limit(1)
      .get();

    if (!emailSnapshot.empty || !usernameSnapshot.empty) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUserId = uuidv4();

    const newUser = {
      id: newUserId,
      username,
      email,
      password,
      bio: bio || "",
      blogs: [],
      img: "",
    };

    // UUID is also the Firestore document ID
    await usersRef.doc(newUserId).set(newUser);

    const token = jwt.sign(
      {
        id: newUserId,
        username,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUserId,
        username,
        email,
        bio: bio || "",
        blogs: [],
        img: "",
      },
    });
  } catch (err) {
    console.error("/api/auth/signup error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}