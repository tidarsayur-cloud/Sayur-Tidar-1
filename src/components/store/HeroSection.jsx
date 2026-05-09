import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen pt-24 pb-16 flex items-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              🌿 Segar setiap hari dari Tidar Sayur
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
              Sayur Segar,{" "}
              <span className="text-primary relative">
                Langsung
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="#2D8632" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
                </svg>
              </span>{" "}
              ke Meja Anda
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Belanja sayur harian jadi lebih mudah, cepat, dan praktis. Tidar Sayur menghadirkan pilihan sayuran segar untuk kebutuhan dapur keluarga di Malang.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <motion.a
                href="#products"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-[40px_12px_40px_12px] font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                Mulai Belanja
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-foreground px-8 py-4 rounded-[40px_12px_40px_12px] font-semibold text-base border border-border hover:border-primary/30 hover:bg-secondary transition-all"
              >
                Hubungi Kami
              </a>
            </div>

            <div className="flex flex-wrap gap-6 text-sm font-medium text-foreground">
              {[
                { icon: Shield, text: "Fresh & Berkualitas" },
                { icon: Zap, text: "Harga Terjangkau" },
                { icon: Truck, text: "Order via WhatsApp" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative"
          >
            <div className="bg-white rounded-[40px_16px_40px_16px] shadow-2xl shadow-primary/10 border border-primary/10 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-gradient-to-br from-primary to-primary/70 rounded-[30px_10px_30px_10px] p-6 text-white text-center">
                  <div className="text-4xl mb-2">🥬🥕🍅</div>
                  <h3 className="font-bold text-lg mb-1">Belanja Lebih Praktis</h3>
                  <p className="text-white/80 text-sm">Pilih produk, masukkan ke keranjang, lalu checkout via WhatsApp.</p>
                </div>
                <div className="bg-secondary rounded-[30px_10px_30px_10px] p-5 text-center border border-primary/10">
                  <div className="text-3xl mb-2">🚚</div>
                  <div className="font-bold text-sm text-foreground">Siap Antar</div>
                  <div className="text-xs text-muted-foreground mt-1">Area Malang & sekitar</div>
                </div>
                <div className="bg-secondary rounded-[30px_10px_30px_10px] p-5 text-center border border-primary/10">
                  <div className="text-3xl mb-2">💚</div>
                  <div className="font-bold text-sm text-foreground">Kualitas Terjaga</div>
                  <div className="text-xs text-muted-foreground mt-1">Dipilih setiap hari</div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2 border border-primary/10 text-sm font-bold text-primary"
              >
                🌱 100% Segar
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-2 border border-primary/10 text-sm font-bold text-foreground"
              >
                ⚡ WhatsApp Ready
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
