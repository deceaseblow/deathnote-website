import clientPromise from '../lib/mongodb.js';
import { v4 as uuidv4 } from 'uuid';

async function main() {
  const client = await clientPromise;
  const db = client.db("deathNote");

  await db.collection("users").deleteMany({});
  await db.collection("blogs").deleteMany({});

  const user1 = { id: uuidv4(), username: "kira", email: "kira@test.com", password: "deathnote123", bio: "I love notebooks", blogs: [] };
  const user2 = { id: uuidv4(), username: "misa", email: "misa@test.com", password: "shinigami", bio: "I follow Kira", blogs: [] };

  await db.collection("users").insertMany([user1, user2]);

  const blog1 = { id: uuidv4(), title: "Kira's First Blog", content: "Justice will be served.", userId: user1.id, createdAt: new Date(), updatedAt: new Date() };
  const blog2 = { id: uuidv4(), title: "Misa's Thoughts", content: "I will support Kira.", userId: user2.id, createdAt: new Date(), updatedAt: new Date() };

  await db.collection("blogs").insertMany([blog1, blog2]);

  await db.collection("users").updateOne({ id: user1.id }, { $push: { blogs: blog1.id } });
  await db.collection("users").updateOne({ id: user2.id }, { $push: { blogs: blog2.id } });

  console.log("Seed completed!");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
