"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SummaryItem {
  ticker: string;
  totalLot: number;
  totalCost: number;
  averageBuy: number;
}

export default function PortofolioPage() {
  const [data, setData] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/transactions/portfolio-summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const json = await res.json();

        if (!Array.isArray(json)) {
          setData([]);
          return;
        }

        setData(json);
      } catch (error) {
        console.error("Gagal memuat ringkasan:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ringkasan Portofolio</h1>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>Tidak ada data portofolio</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Ticker</th>
              <th className="border px-4 py-2">Total Lot</th>
              <th className="border px-4 py-2">Total Cost Rp</th>
              <th className="border px-4 py-2">Rata-rata Beli</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.ticker}>
                <td className="border px-4 py-2">{item.ticker}</td>
                <td className="border px-4 py-2">{item.totalLot}</td>
                <td className="border px-4 py-2">
                  {item.totalCost.toLocaleString("id-ID")}
                </td>
                <td className="border px-4 py-2">
                  {item.averageBuy.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
