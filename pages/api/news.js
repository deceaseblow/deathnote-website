import db from "../../lib/firebase.js";

export default async function handler(req, res) {
  try {
    const newsRef = db.collection("news");

    // GET ALL / GET ONE
    if (req.method === "GET") {
      let snapshot;

      if (req.query.id) {
        snapshot = await newsRef
          .where("id", "==", req.query.id)
          .get();
      } else {
        snapshot = await newsRef.get();
      }

      const newsItems = snapshot.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
      }));

      return res.status(200).json(newsItems);
    }

    // CREATE NEWS
    if (req.method === "POST") {
      const { id, title, content, date } = req.body;

      if (!id || !title || !content || !date) {
        return res.status(400).json({
          message: "id, title, content and date are required",
        });
      }

      const existingNews = await newsRef
        .where("id", "==", id)
        .limit(1)
        .get();

      if (!existingNews.empty) {
        return res.status(409).json({
          message: "News with this id already exists",
        });
      }

      const newNews = {
        id,
        title,
        content,
        date,
      };

      await newsRef.doc(id).set(newNews);

      return res.status(201).json({
        ...newNews,
        _id: id,
      });
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (err) {
    console.error("/api/news error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}