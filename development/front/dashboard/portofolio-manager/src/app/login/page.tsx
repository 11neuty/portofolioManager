"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (res.ok && json.token) {
        localStorage.setItem("token", json.token);
        alert("Login berhasil!");
        router.push("/transactions");
      } else {
        alert(`Login gagal: ${json.msg || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal konek ke server");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
}
