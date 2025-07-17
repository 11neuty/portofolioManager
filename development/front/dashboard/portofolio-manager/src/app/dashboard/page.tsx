"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("loggedInUser")

    // Redirect jika tidak ada token atau data user
    if (!token || !userData) {
      router.push("/login")
    } else {
      try {
        const parsedUser: User = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse user data:", error)
        router.push("/login")
      }
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("loggedInUser")
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  if (loading) {
    return <p className="p-6">Memuat dashboard...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      {user && <p>Selamat datang, <strong>{user.email}</strong>!</p>}

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}
