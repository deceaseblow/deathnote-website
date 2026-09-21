import db from "../../lib/firebase";

export default async function handler(req, res) {
  try {
    await db.collection("test").limit(1).get();

    return res.status(200).json({
      success: true,
      message: "Firebase connection works!",
    });
  } catch (error) {
    console.error("Firebase test error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}