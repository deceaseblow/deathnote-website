import db from "../../../lib/firebase.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const usersRef = db.collection("users");

    // Search by email
    const emailSnapshot = await usersRef
      .where("email", "==", login)
      .limit(1)
      .get();

    // Search by username if email wasn't found
    let userDoc = !emailSnapshot.empty
      ? emailSnapshot.docs[0]
      : null;

    if (!userDoc) {
      const usernameSnapshot = await usersRef
        .where("username", "==", login)
        .limit(1)
        .get();

      if (!usernameSnapshot.empty) {
        userDoc = usernameSnapshot.docs[0];
      }
    }

    if (!userDoc) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = userDoc.data();

    // Keep the same password check for now
    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userDoc.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        blogs: user.blogs,
      },
    });
  } catch (err) {
    console.error("/api/auth/login error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}