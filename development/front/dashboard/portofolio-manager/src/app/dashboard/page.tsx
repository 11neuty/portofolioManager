'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/card'

const DashboardPage = () => {
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const portfolioRes = await fetch(
          'http://localhost:5000/api/transactions/portfolio-summary',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const statsRes = await fetch(
          'http://localhost:5000/api/transactions/transaction-stats',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!portfolioRes.ok || !statsRes.ok) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }

        const portfolioData = await portfolioRes.json()
        const statsData = await statsRes.json()

        setPortfolio(portfolioData)
        setStats(statsData)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [router])

  const totalPortfolioCost = portfolio.reduce(
    (acc, item) => acc + Number(item.totalCost || 0),
    0
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!stats) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Investasi"
          value={`Rp ${Number(stats.totalInvestment || 0).toLocaleString('id-ID')}`}
          color="blue"
        />
        <Card
          title="Total Portofolio"
          value={`Rp ${Number(totalPortfolioCost).toLocaleString('id-ID')}`}
          color="green"
        />
        <Card
          title="Jumlah Aset"
          value={`${portfolio.length} Aset`}
          color="purple"
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Top 5 Saham Berdasarkan Lot
        </h2>

        <table className="w-full border border-white">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 text-left">Ticker</th>
              <th className="px-4 py-2 text-right">Total Lot</th>
              <th className="px-4 py-2 text-right">Average Buy</th>
            </tr>
          </thead>
          <tbody>
            {stats.top5StocksByLot.map((stock: any, idx: number) => (
              <tr key={idx} className="border-t border-white">
                <td className="px-4 py-2">{stock.ticker}</td>
                <td className="px-4 py-2 text-right">{stock.totalLot}</td>
                <td className="px-4 py-2 text-right">
                  Rp {Number(stock.averageBuy).toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage
