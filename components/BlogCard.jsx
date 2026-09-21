import { useRouter } from "next/router";
import Link from "next/link";
export default function BlogCard({ id, title, content, username, createdAt }) {
  const router = useRouter();
  return (
    <div onClick={() => router.push(`/blogs/${id}`)}
      className="w-full bg-black eitai px-10 py-2 border hover:cursor-pointer">
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-col">
          <h3 className="text-white text-[26px] leading-relaxed">
            {title}
          </h3>
        </div>
        <Link
          href={`/users/${username}`}
          onClick={(e) => e.stopPropagation()}
          className="text-white hover:underline"
        >
          @{username || "Unknown"}
        </Link>
        <span className="text-gray-400 text-sm">
          {new Date(createdAt).toLocaleDateString()}
        </span>
        <p className="text-white text-sm leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
