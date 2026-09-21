import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Text from "../../components/Text";
import BlogCard from "../../components/BlogCard";
import Button from "../../components/Button";
import AuthModal from "../../components/AuthModal";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Take data of blogs
  useEffect(() => {
    async function fetchData() {
      try {
        const blogsRes = await fetch("/api/blogs");

        if (!blogsRes.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const blogsData = await blogsRes.json();
        setBlogs(Array.isArray(blogsData) ? blogsData : []);

        if (token) {
          try {
            const decoded = jwtDecode(token);
            const handle = decoded.username;

            if (handle) {
              const userRes = await fetch(`/api/users/${handle}`);

              if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
              }
            }
          } catch (err) {
            console.error("Failed to fetch user:", err);
          }
        }
      } catch (err) {
        console.error(err);
        setError(true);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center px-4 text-center">
        <Text text="ブログを読み込んでいます、しっかり握ってください.." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center px-4 text-center">
        <Text text="現在データベースに接続できません。" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center px-4 text-center">
        <Text text="ブログが見つかりません" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex justify-center">
      
      {/* Navigation bar */}
      <div className="flex justify-between items-center bg-white py-2 px-4 sm:px-6 md:px-10 fixed top-0 left-0 w-full z-50 shadow-md">
        {!user && (
          <Button
            onClick={() => setModalOpen(true)}
            text="Login / Signup"
          />
        )}

        {!user ? (
          <h1 className="font-bold text-sm sm:text-base md:text-lg text-black">
            今すぐ参加しましょう
          </h1>
        ) : (
          <div className="flex justify-between items-center w-full">
            <h1 className="font-bold text-sm sm:text-base md:text-lg text-black">
              おかえり、@{user.username}!
            </h1>

            <button
              onClick={() => router.push(`/users/${user.username}`)}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-all ${
                !user.img ? "bg-gray-700" : ""
              }`}
            >
              {user.img ? (
                <img
                  src={user.img}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black text-sm font-bold text-white">
                  {user.username[0].toUpperCase()}
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Blog content */}
      <div className="flex flex-col gap-10 w-full max-w-5xl py-24 px-4 sm:px-6">
        
        <div className="flex flex-col items-center gap-5">
          <Text text="最近のブログ" />

          <div className="flex flex-col gap-5 w-full max-w-3xl">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                title={blog.title}
                content={blog.content}
                username={blog.username}
                createdAt={blog.createdAt}
                userMatched={user && blog.userId === user.id}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center justify-center mt-6">
            <Button
              onClick={() => router.push("/welcome")}
              text="戻る"
            />

            <Button
              onClick={() => router.push("/news")}
              text="ニュースをチェックする"
            />
          </div>
        </div>
      </div>
    </div>
  );
}