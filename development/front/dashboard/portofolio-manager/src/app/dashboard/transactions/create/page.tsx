"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Listbox } from "@headlessui/react";
import RequireAuth from "@/components/requireAuth";

const typeOptions = [
  { value: "buy", label: "Beli", color: "bg-green-100 text-green-800" },
  { value: "sell", label: "Jual", color: "bg-red-100 text-red-800" },
];

export default function CreateTransactionPage() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [form, setForm] = useState({
    ticker: "",
    type: typeOptions[0],
    lot: 0,
    price: 0,
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        body: JSON.stringify({
          ...form,
          type: form.type.value, // kirim hanya value ke backend
        }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan transaksi");

      toast.success("Transaksi berhasil disimpan!");

      setTimeout(() => {
        router.push("/dashboard/transactions");
      }, 1500);
    } catch (error) {
      toast.error("Gagal menyimpan transaksi.");
    }
  };

  return (
    <RequireAuth>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Ticker */}
          <input
            type="text"
            name="ticker"
            placeholder="Ticker"
            value={form.ticker}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 bg-gray-800 rounded text-white"
          />

          {/* Type (Buy/Sell) with Headless UI */}
          <div>
            <Listbox value={form.type} onChange={(val) => setForm((prev) => ({ ...prev, type: val }))}>
              <div className="relative">
                <Listbox.Button
                  className={`w-full p-2 border rounded ${form.type.color} text-left`}
                >
                  {form.type.label}
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white rounded shadow-md max-h-60 overflow-auto border border-gray-200">
                  {typeOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 ${active ? "bg-blue-100" : ""}`
                      }
                    >
                      {option.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Lot */}
          <input
            type="number"
            name="lot"
            placeholder="Lot"
            value={form.lot}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 bg-gray-800 rounded text-white"
          />

          {/* Harga */}
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 bg-gray-800 rounded text-white"
          />

          {/* Tanggal */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 bg-gray-800 rounded text-white"
          />

          {/* Tombol Simpan */}
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
