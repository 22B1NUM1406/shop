import { useEffect } from "react";

export default function ProductModal({ product, onClose, onBuy }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "slideUp 0.3s ease" }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow"
                >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/2 aspect-square md:aspect-auto">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=f59e0b&color=fff&size=400`;
                            }}
                        />
                    </div>

                    {/* Details */}
                    <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div>
                            <h2
                                className="text-3xl font-black text-gray-900 dark:text-white mb-3"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {product.name}
                            </h2>
                            <p className="text-4xl font-black text-amber-500 mb-6">
                                ₮{product.price.toLocaleString()}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                onClick={() => onBuy(product)}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 tracking-wide"
                            >
                                Худалдаж авах
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-3 rounded-2xl hover:border-gray-300 transition-colors text-sm"
                            >
                                Буцах
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}