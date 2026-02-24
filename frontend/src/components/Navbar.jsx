import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ navigate }) {
    const { dark, toggle } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id) => {
        setMenuOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-lg"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <button
                    onClick={() => scrollTo("hero")}
                    className="text-xl font-black tracking-tight text-gray-900 dark:text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    NOMAD<span className="text-amber-500">.</span>
                </button>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {[
                        { label: "Нүүр", id: "hero" },
                        { label: "Бүтээгдэхүүн", id: "products" },
                        { label: "Холбоо барих", id: "footer" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors tracking-wide"
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={() => navigate("admin-login")}
                        className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                        Админ
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Dark mode toggle */}
                    <button
                        onClick={toggle}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Дарк горим"
                    >
                        {dark ? (
                            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>

                    {/* Hamburger */}
                    <button
                        className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex flex-col gap-4">
                    {[
                        { label: "Нүүр", id: "hero" },
                        { label: "Бүтээгдэхүүн", id: "products" },
                        { label: "Холбоо барих", id: "footer" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 py-1"
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={() => { setMenuOpen(false); navigate("admin-login"); }}
                        className="text-left text-sm text-gray-400 dark:text-gray-500 py-1"
                    >
                        Админ нэвтрэх
                    </button>
                </div>
            )}
        </nav>
    );
}