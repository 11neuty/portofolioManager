"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FiEye, FiEyeOff } from "react-icons/fi"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Login gagal")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("loggedInUser", JSON.stringify(data.user))
      localStorage.setItem("isLoggedIn", "true")

      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      alert("Terjadi kesalahan saat login.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/stars.svg')] bg-cover opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20">
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
            <span className="text-white text-lg">➜</span>
          </div>
        </div>

        <h1 className="text-center text-2xl font-semibold mb-6">Portofolio Manager</h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-white/10 rounded-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 bg-white/10 rounded-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
              className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            Sign in
          </button>
        </form>

        <div className="my-6 text-center text-white/50 text-sm">or</div>

        <button className="w-full flex items-center justify-center gap-2 border border-white/30 bg-white/5 hover:bg-white/10 text-white py-2 rounded-md transition">
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        <div className="mt-8 text-center space-y-3 text-sm text-white/70">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline hover:text-white">
              Sign up, it’s free!
            </Link>
          </p>

          <p className="text-white/50">
            Join over <span className="font-bold text-white">2M</span> global investing users
          </p>

          <div className="flex justify-center items-center gap-2 mt-2">
            <img src="/avatar1.png" className="w-6 h-6 rounded-full border-2 border-white" />
            <img src="/avatar2.png" className="w-6 h-6 rounded-full border-2 border-white -ml-2" />
            <img src="/avatar3.png" className="w-6 h-6 rounded-full border-2 border-white -ml-2" />
            <img src="/avatar4.png" className="w-6 h-6 rounded-full border-2 border-white -ml-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
