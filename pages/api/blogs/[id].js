import db from "../../../lib/firebase.js";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Blog ID is required",
    });
  }

  const blogRef = db.collection("blogs").doc(id);
  const usersRef = db.collection("users");

  try {
    // =========================
    // GET ONE BLOG
    // =========================
    if (req.method === "GET") {
      const blogDoc = await blogRef.get();

      if (!blogDoc.exists) {
        return res.status(404).json({
          message: "Blog not found",
        });
      }

      const blog = blogDoc.data();

      let username = "Unknown";

      if (blog.userId) {
        const userDoc = await usersRef.doc(blog.userId).get();

        if (userDoc.exists) {
          username = userDoc.data().username;
        }
      }

      return res.status(200).json({
        ...blog,
        _id: blogDoc.id,
        username,
        createdAt: blog.createdAt?.toDate
          ? blog.createdAt.toDate().toISOString()
          : blog.createdAt,
        updatedAt: blog.updatedAt?.toDate
          ? blog.updatedAt.toDate().toISOString()
          : blog.updatedAt,
      });
    }

    // =========================
    // UPDATE BLOG
    // =========================
    if (req.method === "PUT") {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          message: "Missing fields",
        });
      }

      const blogDoc = await blogRef.get();

      if (!blogDoc.exists) {
        return res.status(404).json({
          message: "Blog not found",
        });
      }

      const updatedAt = new Date();

      await blogRef.update({
        title,
        content,
        updatedAt,
      });

      // Get the updated document
      const updatedDoc = await blogRef.get();
      const updatedBlog = updatedDoc.data();

      return res.status(200).json({
        ...updatedBlog,
        _id: updatedDoc.id,
        createdAt: updatedBlog.createdAt?.toDate
          ? updatedBlog.createdAt.toDate().toISOString()
          : updatedBlog.createdAt,
        updatedAt: updatedBlog.updatedAt?.toDate
          ? updatedBlog.updatedAt.toDate().toISOString()
          : updatedBlog.updatedAt,
      });
    }

    // =========================
    // DELETE BLOG
    // =========================
    if (req.method === "DELETE") {
      const blogDoc = await blogRef.get();

      if (!blogDoc.exists) {
        return res.status(404).json({
          message: "Blog not found",
        });
      }

      await blogRef.delete();

      return res.status(200).json({
        message: "Blog deleted",
      });
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (err) {
    console.error(`/api/blogs/${id} error:`, err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}