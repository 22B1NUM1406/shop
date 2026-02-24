import { useState, useEffect, useRef } from "react";

// Mock products - replace API_URL with your backend
const MOCK_PRODUCTS = [
    {
        _id: "1",
        name: "Ногоон Цай Шам",
        price: 45000,
        description: "Жинхэнэ Японы ногоон цай. Антиоксидантаар баялаг, эрүүл мэндэд тустай.",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
    },
    {
        _id: "2",
        name: "Хавтгай Дэвтэр Set",
        price: 32000,
        description: "Өндөр чанарын A5 хэмжээний хавтгай дэвтэр, 5 өнгийн бал пентэй иркэм.",
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80",
    },
    {
        _id: "3",
        name: "Ceramic Аяга",
        price: 28000,
        description: "Гар урлалын керамик аяга. Өнгө тогтвортой, дулаан хадгалах чанар сайтай.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80",
    },
    {
        _id: "4",
        name: "Аромат Лаа",
        price: 55000,
        description: "Байгалийн лавандр үнэрт гар хийцийн лаа. 40 цагийн турш шатна.",
        image: "https://images.unsplash.com/photo-1602607144090-ef1d3c47c0af?w=400&q=80",
    },
    {
        _id: "5",
        name: "Хөвөн Хүрэм",
        price: 120000,
        description: "100% органик хөвөн материалаар хийсэн тав тухтай хүрэм. Бүх улиралд тохиромжтой.",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
    },
    {
        _id: "6",
        name: "Дэлхийн Газрын зураг",
        price: 75000,
        description: "Хананы чимэглэлийн том хэмжээний дэлхийн газрын зураг. 100x60cm.",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80",
    },
    {
        _id: "7",
        name: "Модон Тавиур",
        price: 95000,
        description: "Байгалийн модоор хийсэн гэр зохион байгуулалтын тавиур. 3 давхар.",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    },
    {
        _id: "8",
        name: "Ухаалаг Гэрэл",
        price: 65000,
        description: "RGB өнгийн LED гэрэл, утасны апп-аар удирддаг. 16 сая өнгийн тохируулга.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    },
];

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
        // Simulate API call
        const timer = setTimeout(() => {
            setProducts(MOCK_PRODUCTS);
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
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