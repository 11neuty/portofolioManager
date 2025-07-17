"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      router.push("/login");
    } else {
      setIsChecking(false); // artinya user valid, bisa lanjut tampilkan dashboard
    }
  }, []);

  if (isChecking) {
    return <p className="p-6">Memuat dashboard...</p>; // bisa diganti dengan loader
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Selamat datang di dashboard!</p>
      
      <button
  onClick={() => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  }}
  className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
>
  Logout
</button>

    </div>
  );
}
