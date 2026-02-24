import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import OrderModal from "./components/OrderModal";
import PaymentModal from "./components/PaymentModal";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Toast from "./components/Toast";
import BackToTop from "./components/BackToTop";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderProduct, setOrderProduct] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  const navigate = (page) => setCurrentPage(page);

  if (currentPage === "admin-login") {
    return (
      <ThemeProvider>
        <ToastProvider>
          <AdminLogin
            onLogin={(token) => {
              setAdminToken(token);
              setCurrentPage("admin");
            }}
            onBack={() => setCurrentPage("home")}
          />
          <Toast />
        </ToastProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === "admin" && adminToken) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <AdminDashboard
            onLogout={() => {
              setAdminToken(null);
              localStorage.removeItem("adminToken");
              setCurrentPage("home");
            }}
          />
          <Toast />
        </ToastProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
          <Navbar navigate={navigate} />
          <main>
            <Hero />
            <ProductGrid
              onViewProduct={setSelectedProduct}
              onBuyProduct={setOrderProduct}
            />
          </main>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onBuy={(p) => {
                setSelectedProduct(null);
                setOrderProduct(p);
              }}
            />
          )}
          {orderProduct && (
            <OrderModal
              product={orderProduct}
              onClose={() => setOrderProduct(null)}
              onSuccess={(info) => {
                setOrderProduct(null);
                setPaymentInfo(info);
              }}
            />
          )}
          {paymentInfo && (
            <PaymentModal
              info={paymentInfo}
              onClose={() => setPaymentInfo(null)}
            />
          )}
          <footer className="bg-gray-900 dark:bg-black text-gray-400 text-center py-8 mt-20 text-sm">
            <p className="font-light tracking-widest uppercase text-xs mb-2">© 2025 Онлайн Дэлгүүр</p>
            <p className="text-gray-600 text-xs">Бүх эрх хуулиар хамгаалагдсан</p>
          </footer>
          <BackToTop />
        </div>
        <Toast />
      </ToastProvider>
    </ThemeProvider>
  );
}