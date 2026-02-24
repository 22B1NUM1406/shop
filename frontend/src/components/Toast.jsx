import { useToast } from "../context/ToastContext";

export default function Toast() {
    const { toasts } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-medium
            backdrop-blur-md border transition-all
            ${t.type === "success"
                            ? "bg-green-500/90 text-white border-green-400"
                            : t.type === "error"
                                ? "bg-red-500/90 text-white border-red-400"
                                : "bg-gray-900/90 text-white border-gray-700"
                        }`}
                    style={{ animation: "toastIn 0.3s ease" }}
                >
                    {t.type === "success" && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {t.type === "error" && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {t.message}
                </div>
            ))}
            <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}