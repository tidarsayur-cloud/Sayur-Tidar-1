import { Leaf } from "lucide-react";

export default function Footer() {
  const links = [
    { label: "Home", href: "#home" },
    { label: "Promo", href: "#promo" },
    { label: "Produk", href: "#products" },
    { label: "Tentang", href: "#about" },
    { label: "Kontak", href: "#contact" },
  ];

  return (
    <footer className="bg-[#1A241B] text-white/70 pt-14 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-[40px_12px_40px_12px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xl font-bold">Tidar<span className="text-primary/80">Sayur</span></span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Sayur segar, langsung ke meja Anda. Praktis dipesan, nyaman untuk kebutuhan harian keluarga.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigasi</h4>
            <div className="grid gap-2">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Sosial Media</h4>
            <div className="grid gap-2">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
                📸 Instagram
              </a>
              <a
                href="https://wa.me/628XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© 2025 Tidar Sayur – Malang. All rights reserved.</span>
          <span>Made with 💚 for local farmers</span>
        </div>
      </div>
    </footer>
  );
}
