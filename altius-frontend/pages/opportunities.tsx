import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import { createClient, gql } from 'urql';
import { useReserves } from '../app/hooks/useReservesEthereum';
import { cacheExchange, fetchExchange } from '@urql/core';
import { aave_rate_query, ethClient } from '../app/theGraphClients';

type Opportunity = {
  chain: string;
  apy: number;
  strategy: string;
};

// interface Opportunity {
//   name: string;
//   underlyingAsset: string;
//   liquidityRate: number;
//   variableBorrowRate: number;
// }

// interface DataResponse {
//   reserves: Opportunity[];
// }

const mockOpportunities: Opportunity[] =  [
  { chain: 'Polygon', apy: 7.2, strategy: 'Liquidity Provision' },
  { chain: 'Solana', apy: 8.5, strategy: 'Yield Farming' },
  { chain: 'Fantom', apy: 9.1, strategy: 'Staking' },
]

export default function Opportunities() {

  const fetchOpportunities = async () => {
    const response = await ethClient.query(aave_rate_query, { underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }).toPromise();
    console.log('Opportunities:', response.data);
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

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