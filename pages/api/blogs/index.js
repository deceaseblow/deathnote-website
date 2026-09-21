import db from "../../../lib/firebase.js";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  try {
    const blogsRef = db.collection("blogs");
    const usersRef = db.collection("users");

    // =========================
    // CREATE BLOG
    // =========================
    if (req.method === "POST") {
      const { title, content, userId } = req.body;

      if (!title || !content || !userId) {
        return res.status(400).json({
          message: "Missing fields",
        });
      }

      // Check that the user exists
      const userDoc = await usersRef.doc(userId).get();

      if (!userDoc.exists) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const newBlogId = uuidv4();

      const newBlog = {
        id: newBlogId,
        title,
        content,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // UUID becomes the Firestore document ID
      await blogsRef.doc(newBlogId).set(newBlog);

      return res.status(201).json({
        ...newBlog,
        _id: newBlogId,
      });
    }

    // =========================
    // GET BLOGS
    // =========================
    if (req.method === "GET") {
      let snapshot;

      // Get blogs belonging to a specific user
      if (req.query.userId) {
        snapshot = await blogsRef
          .where("userId", "==", req.query.userId)
          .get();
      } else {
        // Get all blogs
        snapshot = await blogsRef.get();
      }

      const blogs = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const blog = doc.data();

          let username = "Unknown";

          if (blog.userId) {
            const userDoc = await usersRef.doc(blog.userId).get();

            if (userDoc.exists) {
              username = userDoc.data().username;
            }
          }

          return {
            ...blog,
            _id: doc.id,
            username,
            createdAt: blog.createdAt?.toDate
              ? blog.createdAt.toDate().toISOString()
              : blog.createdAt,
            updatedAt: blog.updatedAt?.toDate
              ? blog.updatedAt.toDate().toISOString()
              : blog.updatedAt,
          };
        })
      );

      return res.status(200).json(blogs);
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (err) {
    console.error("/api/blogs error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}