import React from 'react'
import { FaDollarSign, FaChartLine, FaWarehouse, FaPiggyBank, FaPercent } from 'react-icons/fa'

const mockData = {
  totalDeposits: 1250000000,
  totalBorrowed: 980000000,
  tvl: 270000000,
  marketsCreated: 12,
  altiusVaults: 5,
  averageApyImprovement: 2.3,
}

const mockMarkets = [
  { name: 'USDC', deposits: 450000000, borrowed: 380000000, apy: 4.2 },
  { name: 'ETH', deposits: 350000000, borrowed: 290000000, apy: 3.8 },
  { name: 'WBTC', deposits: 250000000, borrowed: 180000000, apy: 2.9 },
  { name: 'DAI', deposits: 200000000, borrowed: 130000000, apy: 3.5 },
]

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: JSX.Element;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix = '', suffix = '', icon, color }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
    <div className="flex items-center mb-2">
      <div className={`text-${color}-300 mr-2`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
    </div>
    <p className="text-2xl text-white">{prefix}{value.toLocaleString()}{suffix}</p>
  </div>
);

export default function Dashboard() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-300">Altius Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Total Deposits" 
          value={mockData.totalDeposits} 
          prefix="$" 
          icon={<FaDollarSign size={24} />} 
          color="green"
        />
        <StatCard 
          title="Total Borrowed" 
          value={mockData.totalBorrowed} 
          prefix="$" 
          icon={<FaChartLine size={24} />} 
          color="red"
        />
        <StatCard 
          title="TVL" 
          value={mockData.tvl} 
          prefix="$" 
          icon={<FaWarehouse size={24} />} 
          color="blue"
        />
        <StatCard 
          title="Markets Created" 
          value={mockData.marketsCreated} 
          icon={<FaChartLine size={24} />} 
          color="purple"
        />
        <StatCard 
          title="Altius Vaults" 
          value={mockData.altiusVaults} 
          icon={<FaPiggyBank size={24} />} 
          color="yellow"
        />
        <StatCard 
          title="Average APY Improvement" 
          value={mockData.averageApyImprovement} 
          suffix="%" 
          icon={<FaPercent size={24} />} 
          color="indigo"
        />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-blue-300">Markets Overview</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="text-left bg-gray-700">
              <th className="p-3 text-blue-300">Market</th>
              <th className="p-3 text-green-300">Total Deposits</th>
              <th className="p-3 text-red-300">Total Borrowed</th>
              <th className="p-3 text-yellow-300">APY</th>
            </tr>
          </thead>
          <tbody>
            {mockMarkets.map((market, index) => (
              <tr key={index} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                <td className="p-3 font-semibold">{market.name}</td>
                <td className="p-3 text-green-200">${market.deposits.toLocaleString()}</td>
                <td className="p-3 text-red-200">${market.borrowed.toLocaleString()}</td>
                <td className="p-3 text-yellow-200">{market.apy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
