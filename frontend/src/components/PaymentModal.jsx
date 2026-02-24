import { useEffect, useState } from "react";

export default function PaymentModal({ info, onClose }) {
    const [copied, setCopied] = useState("");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const copy = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(field);
            setTimeout(() => setCopied(""), 2000);
        });
    };

    const CopyRow = ({ label, value, field }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <button
                onClick={() => copy(value, field)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${copied === field
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600"
                    }`}
            >
                {copied === field ? "✓ Хуулагдлаа" : "Хуулах"}
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "slideUp 0.3s ease" }}
            >
                {/* Success header */}
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-white font-black text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Захиалга амжилттай!
                    </h2>
                    <p className="text-green-100 text-sm mt-2">{info.product}</p>
                    <div className="mt-4 bg-white/20 rounded-2xl px-4 py-2 inline-block">
                        <p className="text-white font-mono text-sm">{info.orderNumber}</p>
                    </div>
                </div>

                {/* Payment info */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                            Төлбөрийн мэдээлэл
                        </h3>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-4 py-1 mb-4 border border-amber-200 dark:border-amber-800">
                        <CopyRow label="Банкны нэр" value={info.bankName} field="bank" />
                        <CopyRow label="Дансны нэр" value={info.accountName} field="accName" />
                        <CopyRow label="Дансны дугаар" value={info.accountNumber} field="accNum" />
                        <CopyRow
                            label="Гүйлгээний утга"
                            value={info.reference}
                            field="ref"
                        />
                        <CopyRow
                            label="Дүн"
                            value={`₮${info.amount.toLocaleString()}`}
                            field="amount"
                        />
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <p>🚚 <span className="font-medium">Хүргэлт:</span> {info.delivery}</p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Гүйлгээ хийсний дараа захиалга баталгаажна. Асуух зүйл байвал холбоо барина уу.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3.5 rounded-2xl hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-200"
                    >
                        Ойлголоо
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