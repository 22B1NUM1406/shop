export default function Hero() {
    const scrollToProducts = () => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

            {/* Decorative circles */}
            <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-amber-200/40 dark:bg-amber-900/20 blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-orange-200/30 dark:bg-orange-900/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-amber-200/50 dark:border-amber-900/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-amber-300/40 dark:border-amber-800/30" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                <div className="inline-block bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8 border border-amber-200 dark:border-amber-800">
                    🛍️ Онлайн Дэлгүүр
                </div>

                <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Чанартай
                    <br />
                    <span className="text-amber-500">Бараа</span>
                    <br />
                    <span className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-500 dark:text-gray-400">
                        шуурхай хүргэлттэй
                    </span>
                </h1>

                <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
                    Монголын шилдэг бараа, бүтээгдэхүүнийг гэртээ суугаад захиалаарай.
                    Нэвтрэлгүй, шууд захиалга өгнө.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={scrollToProducts}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-amber-200 dark:hover:shadow-amber-900/50 text-sm tracking-wide"
                    >
                        Бүтээгдэхүүн үзэх →
                    </button>
                    <button
                        onClick={scrollToProducts}
                        className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 font-semibold px-10 py-4 rounded-2xl transition-all duration-200 text-sm tracking-wide"
                    >
                        Хэрхэн захиалах?
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto">
                    {[
                        { num: "200+", label: "Бүтээгдэхүүн" },
                        { num: "1500+", label: "Захиалга" },
                        { num: "99%", label: "Сэтгэл ханамж" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div
                                className="text-2xl font-black text-gray-900 dark:text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {stat.num}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 tracking-wide">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600">
                <span className="text-xs tracking-widest uppercase">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent dark:from-gray-600 animate-pulse" />
            </div>
        </section>
    );
}