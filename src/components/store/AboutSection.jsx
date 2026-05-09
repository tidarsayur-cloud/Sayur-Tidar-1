import { motion } from "framer-motion";
import { MapPin, Eye, Target, CheckCircle } from "lucide-react";

const reasons = [
  "🌱 Produk sayur harian dengan tampilan toko yang mudah digunakan.",
  "🛒 Ada keranjang belanja untuk ringkasan pesanan sebelum checkout.",
  "⚡ Bisa beli langsung per produk melalui WhatsApp.",
  "📍 Cocok untuk kebutuhan rumah tangga, kos, dan usaha kuliner kecil.",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 scroll-mt-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🏪 Tentang Kami
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">Tentang Tidar Sayur</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Tidar Sayur adalah toko sayur lokal yang berfokus pada kesegaran produk, kemudahan pemesanan, dan pelayanan ramah untuk pelanggan di Malang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px_12px_40px_12px] p-8 border border-primary/10 shadow-lg shadow-primary/5"
          >
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              Profil Toko
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Tidar Sayur hadir untuk membantu keluarga mendapatkan sayur segar tanpa harus repot ke pasar. Kami menyediakan aneka sayur pilihan harian dengan proses pemesanan yang sederhana.
            </p>
            <div className="space-y-3">
              {[
                { icon: Eye, label: "Visi", text: "Menjadi toko sayur lokal terpercaya di Malang yang praktis, segar, dan terjangkau." },
                { icon: Target, label: "Misi", text: "Menyediakan sayur berkualitas, menjaga harga tetap ramah, dan memudahkan pemesanan digital." },
                { icon: MapPin, label: "Lokasi", text: "Malang, Jawa Timur." },
              ].map(({ icon: Icon, label, text }) => (
                <div key={label} className="bg-secondary rounded-2xl p-4 border border-primary/8">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-sm">{label}: </span>
                      <span className="text-muted-foreground text-sm">{text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Why Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[40px_12px_40px_12px] p-8 border border-primary/10 shadow-lg shadow-primary/5"
          >
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              Kenapa Pilih Kami?
            </h3>
            <div className="space-y-3">
              {reasons.map((r, i) => (
                <div key={i} className="bg-secondary rounded-2xl p-4 border border-primary/8">
                  <p className="text-muted-foreground text-sm leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
