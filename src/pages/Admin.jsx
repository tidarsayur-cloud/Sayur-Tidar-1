import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Package, MessageSquare, Leaf, Eye, AlertTriangle, Bell, RefreshCw, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminDashboard from "@/components/admin/AdminDashboard";

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

const EMPTY_PRODUCT = {
  name: "",
  price: "",
  unit: "/ikat",
  description: "",
  image_url: "",
  stock: true,
  category: "Sayuran",
  sort_order: 0,
};

export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const qc = useQueryClient();

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("sort_order", 100),
  });

  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: () => base44.entities.ContactMessage.list("-created_date", 50),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editProduct
        ? base44.entities.Product.update(editProduct.id, data)
        : base44.entities.Product.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setModalOpen(false);
      toast.success(editProduct ? "Produk diperbarui!" : "Produk ditambahkan!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk dihapus.");
    },
  });

  const toggleStockMutation = useMutation({
    mutationFn: ({ id, stock }) => base44.entities.Product.update(id, { stock }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.update(id, { is_read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ ...p, price: p.price?.toString() });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate({ ...form, price: Number(form.price) });
  };

  const unread = messages.filter((m) => !m.is_read).length;
  const outOfStock = products.filter((p) => !p.stock);

  return (
    <div className="min-h-screen bg-[#1A241B] font-poppins">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-[#0f1a10] border-r border-white/5 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-[40px_12px_40px_12px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">TidarSayur</div>
                <div className="text-white/40 text-xs">Admin Panel</div>
              </div>
            </div>
          </div>
          <nav className="p-4 flex-1">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null, badgeColor: "" },
              { id: "products", icon: Package, label: "Produk", badge: outOfStock.length > 0 ? outOfStock.length : null, badgeColor: "bg-orange-500" },
              { id: "messages", icon: MessageSquare, label: "Pesan", badge: unread > 0 ? unread : null, badgeColor: "bg-primary" },
            ].map(({ id, icon: Icon, label, badge, badgeColor }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                  tab === id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span className={`${badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/5">
            <a
              href="/"
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              Lihat Website
            </a>
          </div>
        </aside>

        {/* Mobile top tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f1a10] border-t border-white/10 flex">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "products", icon: Package, label: "Produk" },
            { id: "messages", icon: MessageSquare, label: "Pesan" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-4 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                tab === id ? "text-primary" : "text-white/40"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8">
          {tab === "dashboard" && (
            <AdminDashboard products={products} messages={messages} />
          )}

          {tab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Manajemen Produk</h1>
                  <p className="text-white/40 text-sm">{products.length} produk terdaftar</p>
                </div>
                <button
                  onClick={openCreate}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-[30px_10px_30px_10px] font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 min-h-[48px]"
                >
                  <Plus className="w-4 h-4" /> Tambah Produk
                </button>
              </div>

              {/* Restock Alert Banner */}
              {outOfStock.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-orange-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-orange-400 text-sm">⚠ Peringatan Stok Habis</span>
                        <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">
                          {outOfStock.length} produk
                        </span>
                      </div>
                      <p className="text-orange-300/70 text-xs mb-3">
                        Produk berikut stoknya habis dan tidak bisa dipesan pelanggan. Segera lakukan restock!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {outOfStock.map((p) => (
                          <div key={p.id} className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xs font-medium px-3 py-1.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            {p.name}
                            <button
                              onClick={() => toggleStockMutation.mutate({ id: p.id, stock: true })}
                              title="Tandai tersedia"
                              className="ml-1 hover:text-orange-100 transition-colors"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {loadingProducts ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      className={`border rounded-2xl p-4 flex items-center gap-4 ${
                        !p.stock
                          ? "bg-orange-500/5 border-orange-500/25"
                          : "bg-white/5 border-white/8"
                      }`}
                    >
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center text-2xl">🥬</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-white">{p.name}</div>
                          {!p.stock && (
                            <span className="flex items-center gap-1 bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-2.5 h-2.5" /> Restock!
                            </span>
                          )}
                        </div>
                        <div className="text-primary text-sm font-bold">{formatRupiah(p.price)}{p.unit}</div>
                        <div className="text-white/40 text-xs">{p.category}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleStockMutation.mutate({ id: p.id, stock: !p.stock })}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                            p.stock ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-400"
                          }`}
                          title="Toggle stok"
                        >
                          {p.stock ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          {p.stock ? "Tersedia" : "Habis"}
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="w-9 h-9 bg-white/10 hover:bg-white/15 text-white/70 rounded-xl flex items-center justify-center transition-colors"
                          title="Edit produk"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Hapus produk ini?")) deleteMutation.mutate(p.id); }}
                          className="w-9 h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-colors"
                          title="Hapus produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "messages" && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Pesan Masuk</h1>
                <p className="text-white/40 text-sm">{unread} belum dibaca</p>
              </div>
              {loadingMessages ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20 text-white/30">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Belum ada pesan masuk</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`bg-white/5 border rounded-2xl p-5 ${m.is_read ? "border-white/5" : "border-primary/30"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{m.name}</span>
                            {!m.is_read && <span className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                          <div className="text-white/40 text-xs mb-3">{m.email}</div>
                          <p className="text-white/70 text-sm leading-relaxed">{m.message}</p>
                        </div>
                        {!m.is_read && (
                          <button
                            onClick={() => markReadMutation.mutate(m.id)}
                            className="flex-shrink-0 text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-colors"
                          >
                            Tandai dibaca
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-[#1a241b] border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">{editProduct ? "Edit Produk" : "Tambah Produk"}</h2>
                  <button onClick={() => setModalOpen(false)} className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  {[
                    { label: "Nama Produk", key: "name", type: "text", placeholder: "Contoh: Bayam Segar" },
                    { label: "Harga (Rp)", key: "price", type: "number", placeholder: "3000" },
                    { label: "Satuan", key: "unit", type: "text", placeholder: "/ikat" },
                    { label: "URL Gambar", key: "image_url", type: "text", placeholder: "https://..." },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-sm font-medium text-white/70">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        required={["name", "price", "unit"].includes(key)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-white/25"
                      />
                    </div>
                  ))}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/70">Kategori</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {["Sayuran", "Buah", "Paket", "Rempah"].map((c) => (
                        <option key={c} value={c} className="bg-[#1a241b]">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/70">Deskripsi</label>
                    <textarea
                      placeholder="Deskripsi singkat produk..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-white/25"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <span className="text-sm font-medium text-white/70 flex-1">Stok Tersedia</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, stock: !form.stock })}
                      className={`w-12 h-6 rounded-full transition-all relative ${form.stock ? "bg-primary" : "bg-white/20"}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.stock ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/70">Urutan Tampil</label>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="w-full bg-primary text-white py-4 rounded-[30px_10px_30px_10px] font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all min-h-[52px]"
                  >
                    {saveMutation.isPending ? "Menyimpan..." : editProduct ? "Perbarui Produk" : "Simpan Produk"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
