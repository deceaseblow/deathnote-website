import { useEffect, useState } from "react";
import Link from "next/link";
import Text from "../../components/Text";
import Button from "../../components/Button";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(true);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 text-center">
        <Text text="ユーザーを読み込んでいます..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Text text="ユーザーを取得できませんでした。" />

        <Button
          onClick={() => window.location.reload()}
          text="再読み込み"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <Text text="ユーザー" />

          <p className="text-gray-400 text-sm text-center">
            救世主キラ伝説に参加しているユーザー
          </p>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Text text="ユーザーが見つかりません..." />
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">

            {users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.username}`}
                className="block"
              >
                <div className="bg-white rounded-lg px-4 sm:px-6 py-4 hover:bg-gray-200 transition-colors">

                  <div className="flex items-center gap-4">

                    {/* Profile image */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0">
                      {user.img ? (
                        <img
                          src={user.img}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center text-white font-bold">
                          {user.username
                            ? user.username[0].toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>

                    {/* User information */}
                    <div className="min-w-0">
                      <h2 className="font-bold text-lg sm:text-xl text-black truncate">
                        @{user.username}
                      </h2>

                      {user.bio ? (
                        <p className="text-gray-500 text-sm truncate">
                          {user.bio}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">
                          no bio
                        </p>
                      )}
                    </div>

                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}

        {/* Back */}
        <div className="flex justify-center mt-10">
          <Button
            onClick={() => window.history.back()}
            text="戻る"
          />
        </div>

      </div>
    </div>
  );
}