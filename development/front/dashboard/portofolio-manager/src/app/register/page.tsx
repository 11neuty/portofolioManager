"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const emailExists = existingUsers.some((user: any) => user.email === email);
    if (emailExists) {
      alert("Email sudah digunakan!");
      return;
    }

    const newUser = { name, email, password };
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    alert("Registrasi berhasil!");
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center text-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <svg
          viewBox="0 0 1024 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[150%] h-[150%] blur-3xl animate-spin-slow"
        >
          <circle cx="512" cy="512" r="400" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
              gradientTransform="translate(512 512) rotate(90) scale(400)">
              <stop stopColor="#f472b6" />
              <stop offset="1" stopColor="#facc15" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Form Card */}
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account 🎉</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Register
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">or</div>

        <button className="flex items-center justify-center gap-3 w-full border border-gray-600 py-2 rounded-md hover:bg-gray-700 transition duration-150">
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-400 underline hover:text-pink-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
