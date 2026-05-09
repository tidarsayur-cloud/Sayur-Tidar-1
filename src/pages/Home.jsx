import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import Navbar from "@/components/store/Navbar";
import HeroSection from "@/components/store/HeroSection";
import PromoSection from "@/components/store/PromoSection";
import ProductsSection from "@/components/store/ProductsSection";
import AboutSection from "@/components/store/AboutSection";
import ContactSection from "@/components/store/ContactSection";
import CartSidebar from "@/components/store/CartSidebar";
import Footer from "@/components/store/Footer";

const WA_NUMBER = "628XXXXXXXXXX";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("sort_order", 50),
  });

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product) => {
    if (!product.stock) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const buyNow = (product) => {
    if (!product.stock) return;
    const msg = `Halo Tidar Sayur, saya ingin membeli ${product.name} (${formatRupiah(product.price)}${product.unit}).`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  function formatRupiah(num) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  }

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Navbar cartCount={totalItems} onCartOpen={() => setCartOpen(true)} />

      <main>
        <HeroSection />
        <PromoSection />
        <ProductsSection
          products={products}
          isLoading={isLoading}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
        />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
      />
    </div>
  );
}
