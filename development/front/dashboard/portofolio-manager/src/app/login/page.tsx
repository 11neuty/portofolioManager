"use client"

import { useState } from "react"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-white/10 rounded-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-white/10 rounded-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            Sign in
          </button>
        </form>

        <div className="my-4 text-center text-white/50 text-sm">or</div>

        <button className="w-full flex items-center justify-center gap-2 border border-white/30 bg-white/5 hover:bg-white/10 text-white py-2 rounded-md transition">
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        <p className="text-center text-sm mt-4 text-white/70">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline hover:text-white">
            Sign up, it’s free!
          </Link>
        </p>
      </div>

      <div className="absolute bottom-6 text-center w-full text-white/50 text-sm z-10">
        Join over <span className="font-bold text-white">2M</span> global investing users
        <div className="flex justify-center mt-2 gap-[-10px]">
          <img src="/avatar1.png" className="w-6 h-6 rounded-full border-2 border-white" />
          <img src="/avatar2.png" className="w-6 h-6 rounded-full border-2 border-white -ml-2" />
          <img src="/avatar3.png" className="w-6 h-6 rounded-full border-2 border-white -ml-2" />
          <img src="/avatar4.png" className="w-6 h-6 rounded-full border-2 border-white -ml-2" />
        </div>
      </div>
    </div>
  )
}
