import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Text from "../../components/Text";
import Button from "../../components/Button";
import Link from "next/link";

export default function SingleBlogPage() {
  const router = useRouter();
  const { id, edit } = router.query;

  const isEditMode = edit === "true";

  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isOwner, setIsOwner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;

    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");

        const data = await res.json();
        setBlog(data);
        setTitle(data.title);
        setContent(data.content);

        if (token) {
          const decoded = jwtDecode(token);
          if (decoded && decoded.id === data.userId) {
            setIsOwner(true);
          }
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id, token]);

  async function handleUpdate() {
    if (isSaving) return;

    try {
      setIsSaving(true);

      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Update failed");

      // Route back then force a refresh 
      await router.push(`/blogs/${id}`);
      router.reload();
    } catch (err) {
      alert("Failed to update blog");
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isSaving) return;
    if (!confirm("Are you sure you want to delete this blog?")) return;

    setIsSaving(true);

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      router.push("/blogs");
    } catch (err) {
      alert("Failed to delete blog");
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Text text="ブログを読み込んでいます..." />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Text text="ブログが見つかりません。" />
      </div>
    );
  }

  return (
    <div className="eitai min-h-screen bg-black flex justify-center px-4">
      <div className="w-200 mx-auto flex flex-col items-center justify-center gap-10 bg-white">
        <div className="w-full px-10">

          {isEditMode ? (
            <div className="bg-black px-7 py-5 rounded-md">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white mb-4 px-4 py-2 text-black rounded"
                placeholder="Blog title"
                disabled={isSaving}
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full bg-white mb-6 px-4 py-2 text-black rounded resize-none"
                placeholder="Blog content"
                disabled={isSaving}
              />

              <div className="flex gap-4 justify-around">
                <button
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className={`px-6 py-2 font-semibold rounded
                  ${isSaving
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-300"
                    }`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => router.push(`/blogs/${id}`)}
                  disabled={isSaving}
                  className={`px-6 py-2 font-semibold rounded
                  ${isSaving
                      ? "bg-gray-800 cursor-not-allowed"
                      : "bg-red-900 hover:bg-red-700"
                    }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 bg-black px-7 py-5">
              <h1 className="text-white text-3xl font-bold">
                {blog.title}
              </h1>

              <p className="text-gray-400">
                <Link
                  href={`/users/${blog.username}`}
                  className="hover:underline"
                >
                  @{blog.username}
                </Link>
                {" ・ "}
                {new Date(blog.createdAt).toLocaleDateString("ja-JP")}
              </p>

              <div className="text-white whitespace-pre-line leading-relaxed">
                {blog.content}
              </div>

              {isOwner && !isEditMode && (
                <div className="flex gap-4 justify-around">
                  <Button
                    onClick={() => router.push(`/blogs/${id}?edit=true`)}
                    disabled={isSaving}
                    text="Edit"
                  />
                  <Button
                    onClick={handleDelete}
                    disabled={isSaving}
                    text="Delete"
                  />
                </div>
              )}

            </div>
          )}
        </div>
        <Button onClick={() => router.push("/blogs")} text="戻る" />
      </div>
    </div>
  );
}