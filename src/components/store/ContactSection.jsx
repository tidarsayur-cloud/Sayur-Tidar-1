import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Mail, Send, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const contacts = [
  { icon: Phone, label: "WhatsApp", value: "08XXXXXXXXXX" },
  { icon: MapPin, label: "Alamat", value: "Malang, Jawa Timur" },
  { icon: Clock, label: "Jam Operasional", value: "Setiap hari, 06.00 – 20.00" },
  { icon: Mail, label: "Email", value: "tidarsayur@example.com" },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await base44.entities.ContactMessage.create(form);
    setLoading(false);
    setSent(true);
    toast.success("Pesan berhasil dikirim! Kami akan segera menghubungi Anda.");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            📞 Hubungi Kami
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">Kontak & Pesan</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Untuk pemesanan, pertanyaan, atau kerja sama, silakan kirim pesan melalui form atau WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px_12px_40px_12px] p-8 border border-primary/10 shadow-lg shadow-primary/5"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Informasi Kontak</h3>
            <div className="space-y-4">
              {contacts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-secondary rounded-2xl border border-primary/8">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{label}</div>
                    <div className="text-muted-foreground text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px_12px_40px_12px] p-8 border border-primary/10 shadow-lg shadow-primary/5"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Kirim Pesan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nama</label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-border rounded-2xl px-4 py-3.5 text-sm bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-border rounded-2xl px-4 py-3.5 text-sm bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Pesan</label>
                <textarea
                  placeholder="Tulis pesan Anda..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full border border-border rounded-2xl px-4 py-3.5 text-sm bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none placeholder:text-muted-foreground/60"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-[30px_10px_30px_10px] font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all shadow-lg shadow-primary/25 focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[52px]"
              >
                {sent ? (
                  <><CheckCircle className="w-4 h-4" /> Pesan Terkirim!</>
                ) : loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                ) : (
                  <><Send className="w-4 h-4" /> Kirim Pesan</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
