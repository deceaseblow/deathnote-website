import clientPromise from "../lib/mongodb.js";

async function testLogin() {
  const testUser = {
    login: "light", 
    password: "notebook123",
  };

  try {
    const client = await clientPromise;
    const db = client.db("deathNote");
    const users = db.collection("users");

    const user = await users.findOne({
      $or: [{ email: testUser.login }, { username: testUser.login }],
    });

    if (!user || user.password !== testUser.password) {
      console.log("Login failed: invalid credentials");
    } else {
      console.log("Login successful!");
      console.log({
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        blogs: user.blogs,
        img : user.img  
      });
    }
  
  } catch (err) {
    console.error("Error during login test:", err);
  }
}

testLogin();
