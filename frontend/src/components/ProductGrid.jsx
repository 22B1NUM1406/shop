import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
            <div className="p-5">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-1/2 mb-4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
        </div>
    );
}

function ProductCard({ product, onView, onBuy, visible }) {
    return (
        <div
            className={`group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:-translate-y-2 cursor-pointer
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease" }}
        >
            {/* Image */}
            <div className="aspect-square overflow-hidden relative" onClick={() => onView(product)}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=f59e0b&color=fff&size=400`;
                    }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* Info */}
            <div className="p-5">
                <h3
                    className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {product.name}
                </h3>
                <p className="text-amber-500 font-black text-xl mb-4">
                    ₮{product.price.toLocaleString()}
                </p>
                <button
                    onClick={() => onBuy(product)}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3 rounded-2xl hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-200 text-sm tracking-wide hover:scale-[1.02]"
                >
                    Худалдаж авах
                </button>
            </div>
        </div>
    );
}

export default function ProductGrid({ onViewProduct, onBuyProduct }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (err) {
                console.error('Бүтээгдэхүүн татахад алдаа:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (loading) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = parseInt(entry.target.dataset.index);
                        setTimeout(() => {
                            setVisibleCards((prev) => new Set([...prev, idx]));
                        }, idx * 100);
                    }
                });
            },
            { threshold: 0.1 }
        );
        cardRefs.current.forEach((ref) => ref && observer.observe(ref));
        return () => observer.disconnect();
    }, [loading, products]);

    return (
        <section id="products" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-amber-500 text-sm font-semibold tracking-widest uppercase">Каталог</span>
                <h2
                    className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-3 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Бүтээгдэхүүнүүд
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Шилдэг бараа, бүтээгдэхүүнүүдийн цуглуулга. Нэвтрэлгүй шууд захиалаарай.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    : products.map((product, i) => (
                        <div
                            key={product._id}
                            data-index={i}
                            ref={(el) => (cardRefs.current[i] = el)}
                        >
                            <ProductCard
                                product={product}
                                onView={onViewProduct}
                                onBuy={onBuyProduct}
                                visible={visibleCards.has(i)}
                            />
                        </div>
                    ))}
            </div>
        </section>
    );
}