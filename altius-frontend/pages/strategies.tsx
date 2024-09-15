import React from 'react'

const mockStrategies = [
  { name: 'Stable Yield', apy: 5.5, risk: 'Low' },
  { name: 'Balanced Growth', apy: 8.2, risk: 'Medium' },
  { name: 'High Yield', apy: 12.5, risk: 'High' },
]

export default function Strategies() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Strategy Recommendations</h2>
      {mockStrategies.map((strategy, index) => (
        <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{strategy.name}</span>
            <span className="text-green-400">{strategy.apy}% APY</span>
          </div>
          <div className="text-sm text-gray-400">Risk: {strategy.risk}</div>
          <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded">
            Execute
          </button>
        </div>
      ))}
    </div>
  )
}
