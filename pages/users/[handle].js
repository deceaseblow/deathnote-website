import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import BlogCard from "../../components/BlogCard";

export default function ProfilePage() {
  const router = useRouter();
  const { handle } = router.query;
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editImg, setEditImg] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!handle) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/users/${handle}`);
        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        setUser(data);

        if (data.id) {
          const blogsRes = await fetch(`/api/blogs?userId=${data.id}`);

          if (blogsRes.ok) {
            const blogsData = await blogsRes.json();
            setUserBlogs(Array.isArray(blogsData) ? blogsData : []);
          }
        }

        if (token) {
          try {
            const decoded = jwtDecode(token);
            setLoggedInUser(decoded.username);
            setLoggedInUserId(decoded.id);
          } catch (err) {
            console.error("Failed to decode token:", err);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [handle, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/blogs");
  };

  const handleUpdateProfile = async () => {
    if (isUpdatingProfile) return;

    if (!editUsername.trim()) {
      alert("Username cannot be empty");
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const res = await fetch(`/api/users/${handle}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editUsername,
          bio: editBio,
          img: editImg,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data);
      setIsEditingProfile(false);

      if (data.username !== handle) {
        router.push(`/users/${data.username}`);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      alert(err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCreateBlog = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    if (!loggedInUserId) {
      alert("You must be logged in to create a blog");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          userId: loggedInUserId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create blog");

      router.reload();
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Failed to create blog. Please try again.");
      setIsSubmitting(false);
    }
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setNewTitle("");
    setNewContent("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 text-center">
        <p className="text-white text-lg sm:text-xl">
          ユーザーを読み込んでいます ..
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 text-center">
        <p className="text-white text-lg sm:text-xl">
          {error || "User not found"}
        </p>
      </div>
    );
  }

  const isOwnProfile = loggedInUserId && loggedInUserId === user.id;

  return (
    <div className="min-h-screen bg-black text-black">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white min-h-screen flex flex-col gap-8 sm:gap-10 py-6 sm:py-10">

          {/* Profile */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">

            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white">
              {user.img ? (
                <img
                  src={user.img}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-[24px] sm:text-[30px] font-bold text-white">
                  {user.username[0].toUpperCase()}
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold break-all text-center">
              @{user.username}
            </h1>

            {user.bio ? (
              <p className="text-base sm:text-lg text-center max-w-2xl py-2 sm:py-4 px-2 break-words">
                Bio : "{user.bio}"
              </p>
            ) : (
              <p className="text-gray-500 text-center italic mt-2 sm:mt-4">
                no bio written yet.
              </p>
            )}

            {/* Account buttons */}
            {isOwnProfile && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">

                <button
                  onClick={() => {
                    setEditUsername(user.username);
                    setEditBio(user.bio || "");
                    setEditImg(user.img || "");
                    setIsEditingProfile(!isEditingProfile);
                    setIsCreating(false);
                  }}
                  className="w-full sm:w-auto mt-2 sm:mt-6 px-6 sm:px-8 py-2 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                >
                  {isEditingProfile ? "Cancel Edit" : "Update account"}
                </button>

                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className="w-full sm:w-auto mt-0 sm:mt-6 px-6 sm:px-8 py-2 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                >
                  {isCreating ? "Cancel Create" : "Create New Blog"}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto mt-0 sm:mt-6 px-6 sm:px-8 py-2 bg-red-900 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>

              </div>
            )}
          </div>

          {/* Update Profile Form */}
          {isOwnProfile && isEditingProfile && (
            <div className="px-4 sm:px-10">
              <div className="bg-gray-100 p-4 sm:p-6 rounded-lg border-2 border-black">

                <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
                  Update Profile
                </h2>

                <label className="block font-semibold mb-2">
                  Username
                </label>

                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 mb-4 border-2 border-gray-300 rounded focus:outline-none focus:border-black"
                  disabled={isUpdatingProfile}
                />

                <label className="block font-semibold mb-2">
                  Bio
                </label>

                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 mb-4 border-2 border-gray-300 rounded resize-none focus:outline-none focus:border-black"
                  placeholder="Tell us something about yourself..."
                  disabled={isUpdatingProfile}
                />

                <label className="block font-semibold mb-2">
                  Profile Image URL
                </label>

                <input
                  type="text"
                  value={editImg}
                  onChange={(e) => setEditImg(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 mb-6 border-2 border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="https://..."
                  disabled={isUpdatingProfile}
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                    className={`w-full sm:w-auto px-6 py-2 font-semibold rounded ${
                      isUpdatingProfile
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {isUpdatingProfile ? "Updating..." : "Save Changes"}
                  </button>

                  <button
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isUpdatingProfile}
                    className="w-full sm:w-auto px-6 py-2 bg-gray-300 font-semibold rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* Create Blog Form */}
          {isOwnProfile && isCreating && (
            <div className="px-4 sm:px-10">
              <div className="bg-gray-100 p-4 sm:p-6 rounded-lg border-2 border-black">

                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  Create New Blog
                </h2>

                <input
                  type="text"
                  placeholder="Blog Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 mb-4 border-2 border-gray-300 rounded focus:outline-none focus:border-black"
                  disabled={isSubmitting}
                />

                <textarea
                  placeholder="Blog Content"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 sm:px-4 py-2 mb-4 border-2 border-gray-300 rounded resize-none focus:outline-none focus:border-black"
                  disabled={isSubmitting}
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                  <button
                    onClick={handleCreateBlog}
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-6 py-2 font-semibold rounded ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Blog"}
                  </button>

                  <button
                    onClick={cancelCreate}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2 bg-gray-300 font-semibold rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* Blog count */}
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold">
                {userBlogs.length}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">
                Blogs
              </p>
            </div>
          </div>

          {/* Blogs Section */}
          {userBlogs.length > 0 ? (
            <div className="flex flex-col px-4 sm:px-10">

              <h2 className="text-xl sm:text-2xl font-bold border-b border-gray-700 pb-2">
                Published Blogs ({userBlogs.length})
              </h2>

              <div className="space-y-4 mt-4">
                {userBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    onClick={() => router.push(`/blogs/${blog._id}`)}
                    className="cursor-pointer"
                  >
                    <BlogCard
                      id={blog._id}
                      title={blog.title}
                      content={blog.content}
                      username={blog.username}
                      createdAt={blog.createdAt}
                      userMatched={user && blog.userId === user.id}
                    />
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 text-center">

              {isOwnProfile ? (
                <p className="text-gray-500 text-base sm:text-lg italic">
                  You don&apos;t have any blogs yet.
                  <br />
                  <span className="font-semibold text-black">
                    Click “Create New Blog” to make one now!
                  </span>
                </p>
              ) : (
                <p className="text-gray-500 text-base sm:text-lg italic">
                  This user hasn&apos;t posted anything yet.
                </p>
              )}

            </div>
          )}

          {/* Back button */}
          <div className="text-center pb-4">

            <button
              onClick={() => router.back()}
              className="px-10 py-1 bg-white text-black font-semibold font-[eitai] text-[18px] sm:text-[20px] border-none hover:bg-black hover:text-white duration-300 cursor-pointer"
            >
              戻る
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}