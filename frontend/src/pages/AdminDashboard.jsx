import { useState, useEffect, useRef } from "react";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";



function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {title}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function AdminDashboard({ onLogout }) {
    const { addToast } = useToast();
    const [tab, setTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productModal, setProductModal] = useState(null); // null | 'add' | product object
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [form, setForm] = useState({ name: "", price: "", description: "", image: "" });
    const token = localStorage.getItem("adminToken");

    const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch(`${API_URL}/api/orders`, { headers: authHeaders });
            const data = await res.json();
            if (data.success) setOrders(data.data);
        } catch (err) {
            console.error("Orders fetch error:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await fetch(`${API_URL}/api/products`);
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch (err) {
            console.error("Products fetch error:", err);
        } finally {
            setLoadingProducts(false);
        }
    };

    const openAdd = () => {
        setForm({ name: "", price: "", description: "", image: "" });
        setProductModal("add");
    };

    const openEdit = (p) => {
        setForm({ name: p.name, price: p.price, description: p.description, image: p.image });
        setProductModal(p);
    };

    const saveProduct = async () => {
        if (!form.name || !form.price) { addToast("Нэр, үнэ заавал байна", "error"); return; }
        try {
            if (productModal === "add") {
                try {
                    const res = await fetch(`${API_URL}/api/products`, {
                        method: "POST",
                        headers: authHeaders,
                        body: JSON.stringify({ ...form, price: Number(form.price) }),
                    });
                    if (!res.ok) throw new Error();
                    const newP = await res.json();
                    setProducts((prev) => [...prev, newP]);
                } catch {
                    setProducts((prev) => [...prev, { _id: Date.now().toString(), ...form, price: Number(form.price) }]);
                }
                addToast("Бүтээгдэхүүн нэмэгдлээ!", "success");
            } else {
                try {
                    const res = await fetch(`${API_URL}/api/products/${productModal._id}`, {
                        method: "PUT",
                        headers: authHeaders,
                        body: JSON.stringify({ ...form, price: Number(form.price) }),
                    });
                    if (!res.ok) throw new Error();
                } catch { }
                setProducts((prev) => prev.map((p) => p._id === productModal._id ? { ...p, ...form, price: Number(form.price) } : p));
                addToast("Бүтээгдэхүүн шинэчлэгдлээ!", "success");
            }
        } catch {
            addToast("Алдаа гарлаа", "error");
        }
        setProductModal(null);
    };

    const deleteProduct = async (id) => {
        try {
            await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE", headers: authHeaders });
        } catch { }
        setProducts((prev) => prev.filter((p) => p._id !== id));
        addToast("Устгагдлаа", "success");
        setDeleteConfirm(null);
    };

    const fmtDate = (d) => new Date(d).toLocaleString("mn-MN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Top bar */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="text-xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        NOMAD<span className="text-amber-500">.</span>
                        <span className="text-xs font-light text-gray-400 ml-2 tracking-widest uppercase">Admin</span>
                    </span>
                    <button
                        onClick={onLogout}
                        className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Гарах
                    </button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Нийт захиалга", value: orders.length, icon: "📦", color: "amber" },
                        { label: "Нийт бүтээгдэхүүн", value: products.length, icon: "🛍️", color: "blue" },
                        { label: "Өнөөдрийн захиалга", value: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length, icon: "📅", color: "green" },
                        { label: "Шуурхай хүргэлт", value: orders.filter(o => o.delivery === "express").length, icon: "⚡", color: "purple" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <div className="text-3xl font-black text-gray-900 dark:text-white">{s.value}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 w-fit">
                    {[
                        { key: "orders", label: "📦 Захиалгууд" },
                        { key: "products", label: "🛍️ Бүтээгдэхүүн" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key
                                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Orders Tab */}
                {tab === "orders" && (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Захиалгын жагсаалт
                            </h2>
                        </div>
                        {loadingOrders ? (
                            <div className="p-12 text-center text-gray-400">Ачааллаж байна...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            {["Нэр", "Утас", "Бүтээгдэхүүн", "Хаяг", "Хүргэлт", "Огноо"].map((h) => (
                                                <th key={h} className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wide font-semibold">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((o) => (
                                            <tr key={o._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-sm text-gray-900 dark:text-white">{o.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{o.phone}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{o.productName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[160px] truncate">{o.address}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${o.delivery === "express"
                                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                        }`}>
                                                        {o.delivery === "express" ? "⚡ Шуурхай" : "📅 10:00"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-400">{fmtDate(o.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {orders.length === 0 && (
                                    <div className="p-12 text-center text-gray-400">Захиалга байхгүй байна</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Products Tab */}
                {tab === "products" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-black text-gray-900 dark:text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Бүтээгдэхүүн удирдах
                            </h2>
                            <button
                                onClick={openAdd}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-2xl text-sm transition-all hover:scale-[1.02] flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Нэмэх
                            </button>
                        </div>

                        {loadingProducts ? (
                            <div className="p-12 text-center text-gray-400">Ачааллаж байна...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products.map((p) => (
                                    <div key={p._id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=f59e0b&color=fff&size=200`; }}
                                            />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                {p.name}
                                            </h3>
                                            <p className="text-amber-500 font-black text-lg mt-1">₮{Number(p.price).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-400 font-semibold py-2.5 rounded-xl text-xs transition-all"
                                                >
                                                    ✏️ Засах
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(p)}
                                                    className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-semibold py-2.5 rounded-xl text-xs transition-all"
                                                >
                                                    🗑️ Устгах
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Product Add/Edit Modal */}
            {productModal && (
                <Modal
                    title={productModal === "add" ? "Бүтээгдэхүүн нэмэх" : "Засах"}
                    onClose={() => setProductModal(null)}
                >
                    <div className="flex flex-col gap-4">
                        {[
                            { key: "name", label: "Нэр", placeholder: "Бүтээгдэхүүний нэр" },
                            { key: "price", label: "Үнэ (₮)", placeholder: "45000", type: "number" },
                            { key: "image", label: "Зургийн URL", placeholder: "https://..." },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                                <input
                                    type={f.type || "text"}
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:border-amber-400 transition-colors"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Тайлбар</label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:border-amber-400 transition-colors resize-none"
                            />
                        </div>
                        <button
                            onClick={saveProduct}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] mt-2"
                        >
                            {productModal === "add" ? "Нэмэх" : "Хадгалах"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* Delete confirm */}
            {deleteConfirm && (
                <Modal title="Устгах уу?" onClose={() => setDeleteConfirm(null)}>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                        <span className="font-semibold text-gray-900 dark:text-white">{deleteConfirm.name}</span>-г устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Болих
                        </button>
                        <button
                            onClick={() => deleteProduct(deleteConfirm._id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-all"
                        >
                            Устгах
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
