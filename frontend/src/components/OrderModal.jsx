import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function OrderModal({ product, onClose, onSuccess }) {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        delivery: "express",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Нэр оруулна уу";
        if (!form.phone.trim() || !/^\d{8}$/.test(form.phone.trim())) e.phone = "8 оронтой утасны дугаар";
        if (!form.address.trim()) e.address = "Хаяг оруулна уу";
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    productId: product._id,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Алдаа гарлаа");

            onSuccess({
                orderNumber: data.orderNumber,
                bankName: data.payment.bankName,
                accountName: data.payment.accountName,
                accountNumber: data.payment.accountNumber,
                amount: data.payment.amount,
                reference: data.payment.reference,
                product: product.name,
                delivery: form.delivery === "express" ? "Шуурхай хүргэлт" : "Өдөр бүрийн 10:00",
            });
            addToast("Захиалга амжилттай илгээгдлээ!", "success");
        } catch (err) {
            addToast(err.message || "Алдаа гарлаа. Дахин оролдоно уу.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "slideUp 0.3s ease" }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-white font-black text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Захиалга өгөх
                            </h2>
                            <p className="text-amber-100 text-sm mt-1">{product.name}</p>
                        </div>
                        <button onClick={onClose} className="text-white/80 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-4 bg-white/20 rounded-2xl p-3 flex justify-between items-center">
                        <span className="text-white text-sm">Нийт дүн</span>
                        <span className="text-white font-black text-lg">₮{product.price.toLocaleString()}</span>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6 flex flex-col gap-4">
                    {/* Name */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                            Овог нэр *
                        </label>
                        <input
                            type="text"
                            placeholder="Дорж Батбаатар"
                            value={form.name}
                            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                            className={`w-full px-4 py-3 rounded-2xl border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-colors
                ${errors.name ? "border-red-400" : "border-gray-200 dark:border-gray-700 focus:border-amber-400"}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                            Утасны дугаар *
                        </label>
                        <input
                            type="tel"
                            placeholder="99112233"
                            value={form.phone}
                            onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                            className={`w-full px-4 py-3 rounded-2xl border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-colors
                ${errors.phone ? "border-red-400" : "border-gray-200 dark:border-gray-700 focus:border-amber-400"}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                            Хүргэлтийн хаяг *
                        </label>
                        <textarea
                            placeholder="Хан-Уул дүүрэг, 15-р хороо..."
                            rows={2}
                            value={form.address}
                            onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: "" }); }}
                            className={`w-full px-4 py-3 rounded-2xl border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-colors resize-none
                ${errors.address ? "border-red-400" : "border-gray-200 dark:border-gray-700 focus:border-amber-400"}`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Delivery */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                            Хүргэлтийн төрөл
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: "express", label: "⚡ Шуурхай", sub: "2-4 цагт" },
                                { value: "daily", label: "📅 Өдөр бүр", sub: "10:00 цагт" },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setForm({ ...form, delivery: opt.value })}
                                    className={`p-3 rounded-2xl border-2 text-left transition-all
                    ${form.delivery === opt.value
                                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-amber-300"
                                        }`}
                                >
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{opt.label}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.sub}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Илгээж байна...
                            </span>
                        ) : "Захиалга баталгаажуулах →"}
                    </button>
                </div>

                <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
            </div>
        </div>
    );
}
