"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        alert("Registrasi berhasil! Silakan login.")
        router.push("/login")
      } else {
        const error = await response.json()
        alert(error.message || "Registrasi gagal")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan saat mendaftar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/stars.svg')] bg-cover opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20">
        <h1 className="text-center text-2xl font-semibold mb-6">Create your account</h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 bg-white/10 rounded-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-white/10 rounded-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-white/10 rounded-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-white/70">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-white">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
