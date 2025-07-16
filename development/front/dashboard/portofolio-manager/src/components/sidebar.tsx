// src/components/Sidebar.tsx
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Portofolio App</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/">Dashboard</Link>
        <Link href="/transactions">Transaksi</Link>
        <Link href="/portofolio">Portofolio</Link>
        <Link href="/stats">Statistik</Link>
      </nav>
    </aside>
  );
}
