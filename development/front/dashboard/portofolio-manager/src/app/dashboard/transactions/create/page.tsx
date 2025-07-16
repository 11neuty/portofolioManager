"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTransactionPage() {
  const [form, setForm] = useState({
    ticker: "",
    type: "buy",
    lot: 0,
    price: 0,
    date: "",
  });

  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "lot" || name === "price" ? Number(value) : value,
    }));
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
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat menambahkan transaksi");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow bg-white">
      <h1 className="text-xl font-bold mb-4">Tambah Transaksi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="ticker"
          value={form.ticker}
          onChange={handleChange}
          placeholder="Ticker (contoh: BBCA)"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <input
          name="lot"
          type="number"
          value={form.lot}
          onChange={handleChange}
          placeholder="Jumlah Lot"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Harga per Lot"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
}
