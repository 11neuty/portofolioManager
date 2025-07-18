// src/app/dashboard/layout.tsx
import '../globals.css'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 shadow-md p-6 space-y-4 hidden md:block">
        <h2 className="text-xl font-semibold text-white mb-6">My Dashboard</h2>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block text-gray-300 hover:text-blue-400">Dashboard</Link>
          <Link href="/dashboard/transactions" className="block text-gray-300 hover:text-blue-400">Transaksi</Link>
          <Link href="/dashboard/porto" className="block text-gray-300 hover:text-blue-400">Portofolio</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-900 text-white relative">
        {children}
        {/* Toast notification */}
        <ToastContainer position="top-center" autoClose={2000} />
      </main>
    </div>
  )
}
