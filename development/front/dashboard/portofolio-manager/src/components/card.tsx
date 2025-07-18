import React from 'react'

interface CardProps {
  title: string
  value: string
  color: 'blue' | 'green' | 'purple'
}

const Card: React.FC<CardProps> = ({ title, value, color }) => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className={`p-6 rounded-lg shadow-md text-white ${colorMap[color]}`}>
      <div className="text-sm">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

export default Card
