import React from 'react'

const mockPositions = [
  { asset: 'USDT', protocol: 'Aave', chain: 'Ethereum', apy: 5.2, tvl: 10000 },
  { asset: 'USDC', protocol: 'Curve', chain: 'BSC', apy: 4.8, tvl: 15000 },
  { asset: 'DAI', protocol: 'Yearn', chain: 'Avalanche', apy: 6.1, tvl: 8000 },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Current Positions</h2>
      {mockPositions.map((position, index) => (
        <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{position.asset}</span>
            <span className={`text-sm ${position.apy >= 6 ? 'text-green-400' : 'text-yellow-400'}`}>
              {position.apy}% APY
            </span>
          </div>
          <div className="text-sm text-gray-400">
            <span>{position.protocol} on {position.chain}</span>
          </div>
          <div className="mt-2 text-right text-sm">
            TVL: ${position.tvl.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
