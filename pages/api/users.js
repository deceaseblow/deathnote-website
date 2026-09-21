import db from "../../lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    const users = snapshot.docs.map((doc) => {
      const user = doc.data();

      const { password, ...safeUser } = user;

      return {
        ...safeUser,
        _id: doc.id,
      };
    });

    return res.status(200).json(users);
  } catch (err) {
    console.error("/api/users error:", err);

    return res.status(500).json([]);
  }
}