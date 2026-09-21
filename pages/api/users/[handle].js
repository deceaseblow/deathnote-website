import db from "../../../lib/firebase.js";

export default async function handler(req, res) {
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({
      message: "Username is required",
    });
  }

  const usersRef = db.collection("users");

  try {
    // =========================
    // GET USER
    // =========================
    if (req.method === "GET") {
      const snapshot = await usersRef
        .where("username", "==", handle)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userDoc = snapshot.docs[0];
      const user = userDoc.data();

      const { password, ...safeUser } = user;

      return res.status(200).json({
        ...safeUser,
        _id: userDoc.id,
      });
    }

    // =========================
    // UPDATE USER
    // =========================
    if (req.method === "PUT") {
      const { username, bio, img } = req.body;

      if (!username || !username.trim()) {
        return res.status(400).json({
          message: "Username is required",
        });
      }

      // Find current user
      const snapshot = await usersRef
        .where("username", "==", handle)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userDoc = snapshot.docs[0];

      // Check whether the new username is already taken
      if (username !== handle) {
        const existingUser = await usersRef
          .where("username", "==", username)
          .limit(1)
          .get();

        if (!existingUser.empty) {
          return res.status(409).json({
            message: "Username already exists",
          });
        }
      }

      await usersRef.doc(userDoc.id).update({
        username: username.trim(),
        bio: bio || "",
        img: img || "",
      });

      const updatedDoc = await usersRef.doc(userDoc.id).get();
      const updatedUser = updatedDoc.data();

      const { password, ...safeUser } = updatedUser;

      return res.status(200).json({
        ...safeUser,
        _id: updatedDoc.id,
      });
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (err) {
    console.error("/api/users/[handle] error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}