"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RequireAuth from "@/components/requireAuth";

export default function CreateTransactionPage() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [form, setForm] = useState({
    ticker: "",
    type: "buy",
    lot: 0,
    price: 0,
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menambahkan transaksi");
      router.push("/transactions");
    } catch (error) {
      alert("Gagal menyimpan transaksi.");
    }
  };

  return (
    <RequireAuth>
      <div className="p-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="ticker"
            placeholder="Ticker"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="type"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="buy">Beli</option>
            <option value="sell">Jual</option>
          </select>
          <input
            type="number"
            name="lot"
            placeholder="Lot"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}
