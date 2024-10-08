import React from 'react'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'
import { FaDollarSign, FaChartLine, FaPercent } from 'react-icons/fa'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Mock data for charts
const barChartData = {
  labels: ['Ethereum', 'BSC', 'Avalanche', 'Polygon', 'Solana'],
  datasets: [
    {
      label: 'TVL ($)',
      data: [50000, 35000, 25000, 20000, 15000],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Portfolio Value',
    data: [3000, 3800, 3500, 4700, 4200, 6100, 5800, 8200, 7500, 10300, 11800, 12500],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0
  }]
};

const doughnutChartData = {
  labels: ['USDC', 'ETH', 'WBTC', 'USDT', 'DAI'],
  datasets: [
    {
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
    },
  ],
}

// Updated Doughnut chart options
const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        font: {
          size: 12 // Adjust this value to change the legend font size
        }
      }
    },
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  }
};

// Mock data for active strategies
const activeStrategies = [
  { name: 'Aave Yield Farming', apy: 5.2, invested: 5000, earned: 260, active: true },
  { name: 'Curve Stablecoin LP', apy: 4.8, invested: 10000, earned: 480, active: true },
  { name: 'Uniswap V3 LP', apy: 8.5, invested: 7500, earned: 637.5, active: false },
  { name: 'Compound Lending', apy: 3.9, invested: 15000, earned: 585, active: true },
  { name: 'Yearn Vault', apy: 6.7, invested: 8000, earned: 536, active: false },
]

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix = '', suffix = '', icon }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
    <div className="flex items-center mb-2">
      <div className="text-blue-300 mr-2">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
    </div>
    <p className="text-2xl text-white">{prefix}{value.toLocaleString()}{suffix}</p>
  </div>
);

export default function Portfolio() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-300">Your Portfolio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Total Value" 
          value={145000} 
          prefix="$" 
          icon={<FaDollarSign size={24} />} 
        />
        <StatCard 
          title="Total Earnings" 
          value={2498} 
          prefix="$" 
          icon={<FaChartLine size={24} />} 
        />
        <StatCard 
          title="Average APY" 
          value={5.82} 
          suffix="%" 
          icon={<FaPercent size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-300">TVL by Chain</h3>
          <Bar data={barChartData} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-300">Portfolio Performance</h3>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-300">Asset Allocation</h3>
          <div className="w-[70%] mx-auto"> {/* Increased width to 70% */}
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-300">Active Strategies</h3>
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            {activeStrategies.map((strategy, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{strategy.name}</span>
                  <span className={`inline-block w-3 h-3 rounded-full ${strategy.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                <div className="text-sm text-gray-300">
                  <span>APY: {strategy.apy}% | </span>
                  <span>Invested: ${strategy.invested.toLocaleString()} | </span>
                  <span>Earned: ${strategy.earned.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
    }
  }
};