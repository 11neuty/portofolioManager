"use client";

import { useEffect, useState } from "react";

interface StockStat {
  ticker: string;
  totalLot: number;
  averageBuy: number;
}

interface StatsResponse {
  totalInvestment: number;
  buyCount: number;
  sellCount: number;
  highestAverageBuy: number;
  lowestAverageBuy: number;
  top5StocksByLot: StockStat[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions/transaction-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setStats(json);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Gagal ambil statistik:", error.message);
      } else {
        console.error("Gagal ambil statistik:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="p-6">Memuat statistik...</p>;

  if (!stats) return <p className="p-6 text-red-500">Statistik tidak tersedia.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Statistik Transaksi</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total Modal Investasi" value={`Rp ${stats.totalInvestment.toLocaleString("id-ID")}`} />
        <Stat label="Jumlah Beli" value={stats.buyCount} />
        <Stat label="Jumlah Jual" value={stats.sellCount} />
        <Stat label="Average Buy Tertinggi" value={`Rp ${stats.highestAverageBuy.toLocaleString("id-ID")}`} />
        <Stat label="Average Buy Terendah" value={`Rp ${stats.lowestAverageBuy.toLocaleString("id-ID")}`} />
      </div>

      <h2 className="text-lg font-semibold mb-2">Top 5 Saham Berdasarkan Lot</h2>
      <table className="w-full table-auto border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Ticker</th>
            <th className="border px-2 py-1">Total Lot</th>
            <th className="border px-2 py-1">Average Buy</th>
          </tr>
        </thead>
        <tbody>
          {stats.top5StocksByLot.map((stock) => (
            <tr key={stock.ticker}>
              <td className="border px-2 py-1">{stock.ticker}</td>
              <td className="border px-2 py-1">{stock.totalLot}</td>
              <td className="border px-2 py-1">Rp {stock.averageBuy.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border p-4 rounded shadow-sm">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
