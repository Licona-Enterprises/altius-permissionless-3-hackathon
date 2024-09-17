import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

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
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Portfolio Value ($)',
      data: [10000, 12000, 11500, 13000, 14500, 16000],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
}

export default function Analytics() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">TVL by Chain</h3>
          <Bar data={barChartData} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Portfolio Performance</h3>
          <Line data={lineChartData} />
        </div>
      </div>
    </div>
  )
}
