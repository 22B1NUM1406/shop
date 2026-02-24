import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin({ onLogin, onBack }) {
    const { addToast } = useToast();
    const { dark, toggle } = useTheme();
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!form.username || !form.password) {
            addToast("Нэр, нууц үг оруулна уу", "error");
            return;
        }
        setLoading(true);
        try {
            let token;
            try {
                const res = await fetch(`${API_URL}/api/admin/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error("Unauthorized");
                const data = await res.json();
                token = data.token;
            } catch {
                // Demo mode - allow admin/admin123
                if (form.username === "admin" && form.password === "admin123") {
                    token = "demo-token-" + Date.now();
                } else {
                    throw new Error("Нэр эсвэл нууц үг буруу байна");
                }
            }
            localStorage.setItem("adminToken", token);
            addToast("Амжилттай нэвтэрлээ!", "success");
            onLogin(token);
        } catch (err) {
            addToast(err.message || "Нэвтрэх боломжгүй", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-300 text-sm mb-8 flex items-center gap-2 mx-auto transition-colors"
                    >
                        ← Буцах
                    </button>
                    <h1
                        className="text-4xl font-black text-white mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        NOMAD<span className="text-amber-500">.</span>
                    </h1>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">Admin Panel</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 block">
                                Хэрэглэгчийн нэр
                            </label>
                            <input
                                type="text"
                                placeholder="admin"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 block">
                                Нууц үг
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] mt-2"
                        >
                            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                        </button>
                    </div>

                    <p className="text-center text-gray-600 text-xs mt-6">
                        Demo: admin / admin123
                    </p>
                </div>
            </div>
        </div>
    );
}