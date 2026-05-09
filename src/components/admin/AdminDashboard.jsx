import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ShoppingBag, Package, MessageSquare, AlertTriangle, TrendingUp } from "lucide-react";
import { format, subDays, parseISO } from "date-fns";
import { id } from "date-fns/locale";

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

function StatCard({ icon: Icon, label, value, sub, color = "text-primary" }) {
  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
      <div className="text-white/60 text-sm font-medium">{label}</div>
      {sub && <div className="text-white/30 text-xs mt-1">{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1a10] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        <p className="text-primary font-bold text-sm">{payload[0].value} pesan</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard({ products, messages }) {
  const outOfStock = products.filter((p) => !p.stock).length;
  const unread = messages.filter((m) => !m.is_read).length;
  const inStock = products.filter((p) => p.stock).length;

  // Build last 14 days chart data from messages created_date
  const chartData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = subDays(new Date(), 13 - i);
      return {
        date: format(d, "dd MMM", { locale: id }),
        dateKey: format(d, "yyyy-MM-dd"),
        pesan: 0,
      };
    });

    messages.forEach((m) => {
      if (!m.created_date) return;
      const key = m.created_date.slice(0, 10);
      const day = days.find((d) => d.dateKey === key);
      if (day) day.pesan += 1;
    });

    return days;
  }, [messages]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, jumlah]) => ({ name, jumlah }));
  }, [products]);

  const totalMessages = messages.length;
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todayMessages = messages.filter((m) => m.created_date?.slice(0, 10) === todayKey).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm">Ringkasan aktivitas toko Tidar Sayur</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Produk" value={products.length} sub={`${inStock} tersedia`} color="text-primary" />
        <StatCard icon={AlertTriangle} label="Stok Habis" value={outOfStock} sub="perlu restock" color={outOfStock > 0 ? "text-orange-400" : "text-white/40"} />
        <StatCard icon={MessageSquare} label="Total Pesan" value={totalMessages} sub={`${unread} belum dibaca`} color="text-blue-400" />
        <StatCard icon={TrendingUp} label="Pesan Hari Ini" value={todayMessages} sub={format(new Date(), "dd MMMM yyyy", { locale: id })} color="text-emerald-400" />
      </div>

      {/* Area Chart - Pesan per Hari */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <h2 className="text-white font-bold text-sm">Tren Pesan Masuk — 14 Hari Terakhir</h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPesan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(123 51% 34%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(123 51% 34%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="pesan"
              stroke="hsl(123 51% 45%)"
              strokeWidth={2.5}
              fill="url(#colorPesan)"
              dot={{ fill: "hsl(123 51% 45%)", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "hsl(123 51% 55%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Produk per Kategori */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <h2 className="text-white font-bold text-sm">Produk per Kategori</h2>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#0f1a10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
              labelStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
              itemStyle={{ color: "#60a5fa", fontWeight: "bold" }}
            />
            <Bar dataKey="jumlah" fill="#60a5fa" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
