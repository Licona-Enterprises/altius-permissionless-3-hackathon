import React from 'react'

const mockOpportunities = [
  { chain: 'Polygon', apy: 7.2, strategy: 'Liquidity Provision' },
  { chain: 'Solana', apy: 8.5, strategy: 'Yield Farming' },
  { chain: 'Fantom', apy: 9.1, strategy: 'Staking' },
]

export default function Opportunities() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Cross-Chain Opportunities</h2>
      {mockOpportunities.map((opportunity, index) => (
        <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{opportunity.chain}</span>
            <span className="text-green-400">{opportunity.apy}% APY</span>
          </div>
          <div className="text-sm text-gray-400">{opportunity.strategy}</div>
          <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded">
            Optimize Now
          </button>
        </div>
      ))}
    </div>
  )
}
