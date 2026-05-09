import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, ShoppingBag, MessageCircle, CalendarClock } from "lucide-react";

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

const WA_NUMBER = "628XXXXXXXXXX";

// Get today's date in YYYY-MM-DD format for min attribute
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function CartSidebar({ cart, isOpen, onClose, onRemove }) {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const lines = cart.map((item, idx) =>
      `${idx + 1}. ${item.name} x${item.qty} = ${formatRupiah(item.price * item.qty)}`
    );
    const scheduleInfo = deliveryDate
      ? `\n📅 Jadwal Pengiriman: ${deliveryDate}${deliveryTime ? ` pukul ${deliveryTime}` : ""}`
      : "";
    const msg =
      `Halo Tidar Sayur, saya ingin checkout pesanan berikut:\n` +
      lines.join("\n") +
      `\n\nTotal: ${formatRupiah(totalPrice)}` +
      scheduleInfo +
      `\nMohon informasi ketersediaan dan proses pengirimannya.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl flex flex-col"
        aria-label="Keranjang belanja"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Keranjang Belanja</h3>
              <p className="text-xs text-muted-foreground">{totalItems} item</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center hover:bg-border transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Tutup keranjang"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-semibold text-foreground mb-2">Keranjang Masih Kosong</p>
              <p className="text-sm text-muted-foreground">Yuk pilih sayur segar favorit Anda!</p>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 bg-secondary/50 rounded-2xl p-4 border border-border"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center text-2xl">
                      🥬
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{formatRupiah(item.price)} x {item.qty}</p>
                    <p className="font-bold text-primary text-sm mt-1">{formatRupiah(item.price * item.qty)}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="flex-shrink-0 w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center transition-colors focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                    aria-label={`Hapus ${item.name} dari keranjang`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-5 space-y-4 bg-white">
          {/* Delivery Schedule */}
          {cart.length > 0 && (
            <div className="bg-secondary/60 rounded-2xl p-4 space-y-3 border border-primary/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarClock className="w-4 h-4 text-primary" />
                Jadwal Pengiriman (opsional)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tanggal</label>
                  <input
                    type="date"
                    min={todayStr()}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full text-sm border border-border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Waktu</label>
                  <input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full text-sm border border-border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                  />
                </div>
              </div>
              {deliveryDate && (
                <p className="text-xs text-primary font-medium">
                  ✅ Diantar: {deliveryDate}{deliveryTime ? ` pukul ${deliveryTime}` : ""}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Total Belanja</span>
            <span className="font-bold text-xl text-primary">{formatRupiah(totalPrice)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Checkout akan mengirim ringkasan pesanan ke WhatsApp kami.</p>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-primary text-white py-4 rounded-[30px_10px_30px_10px] font-bold text-base hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[56px]"
          >
            <MessageCircle className="w-5 h-5" />
            Kirim ke WhatsApp Kami
          </button>
        </div>
      </motion.aside>
    </>
  );
}
