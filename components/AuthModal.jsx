import { useState } from "react";
import { useRouter } from "next/router";

export default function AuthModal({ isOpen, onClose }) {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        bio: "",
    });
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isLogin ? "/api/auth/login" : "/api/auth/signup";

        const payload = isLogin
            ? {
                  login: formData.username || formData.email,
                  password: formData.password,
              }
            : {
                  username: formData.username,
                  email: formData.email,
                  password: formData.password,
                  bio: formData.bio || "",
              };

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Something went wrong");
                return;
            }

            // ✅ Save token
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            // Close modal
            onClose();

            // Reset form
            setFormData({
                username: "",
                email: "",
                password: "",
                bio: "",
            });

            // 🔥 FULL PAGE REFRESH
            router.reload();

        } catch (err) {
            console.error(err);
            setMessage("Network error");
        }
    };

    return (
        <div className="eitai fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-black text-white rounded-2xl px-8 py-12 w-full max-w-md relative shadow-2xl border border-white/20">
                <button
                    className="text-[24px] absolute top-3 right-3 py-1 px-3 text-white hover:text-gray-400 cursor-pointer transition"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2 className="text-3xl font-bold mb-6 text-center">
                    {isLogin ? "ログイン" : "サインアップ"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="px-4 py-2 rounded-lg bg-white text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="px-4 py-2 rounded-lg bg-white text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </>
                    )}

                    {isLogin && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username / Email"
                            value={formData.username}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-lg bg-white text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                            required
                        />
                    )}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="px-4 py-2 rounded-lg bg-white text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                    />

                    {message && (
                        <p className="text-red-400 text-sm text-center">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="px-6 py-2 bg-white text-black font-semibold text-lg rounded-lg hover:bg-black hover:text-white cursor-pointer transition duration-300"
                    >
                        {isLogin ? "Login" : "Signup"}
                    </button>
                </form>

                <p className="text-sm text-gray-300 mt-4 text-center">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}{" "}
                    <button
                        className="text-white hover:text-gray-400 underline"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage("");
                        }}
                    >
                        {isLogin ? "Signup now" : "Login now"}
                    </button>
                </p>
            </div>
        </div>
    );
}
