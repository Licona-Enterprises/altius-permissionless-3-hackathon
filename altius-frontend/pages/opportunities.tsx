import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import { createClient, gql } from 'urql';
import { useReserves } from '../app/hooks/useReservesEthereum';
import { cacheExchange, fetchExchange } from '@urql/core';
import { aave_rate_query, ethClient, avaxClient, arbitrumClient } from '../app/theGraphClients';

type Opportunity = {
  chain: string;
  apy: number;
  strategy: string;
};

export default function Opportunities() {

  const ethFetchOpportunities = async () => {
    try {
      // Fetch Ethereum, Avalanche, and Arbitrum opportunities concurrently
      const [ethResponse, avaxResponse, arbResponse] = await Promise.all([
        ethClient.query(aave_rate_query, { underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }).toPromise(),
        avaxClient.query(aave_rate_query, { underlyingAsset: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E' }).toPromise(),
        arbitrumClient.query(aave_rate_query, { underlyingAsset: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' }).toPromise(),
      ]);

      console.log("Responses received:", { ethResponse, avaxResponse, arbResponse });
  
      // Process Ethereum opportunities
      const ethFetchedOpportunities = ethResponse.data.reserves.map((reserve: any) => ({
        chain: 'Ethereum Sepolia',
        apy: Math.round((reserve.liquidityRate / 10**25) * 100) / 100,
        strategy: 'USDC Lending',
      }));
  
      // Process Avalanche opportunities
      const avaxFetchedOpportunities = avaxResponse.data.reserves.map((reserve: any) => ({
        chain: 'Avalanche Fuji',
        apy: Math.round((reserve.liquidityRate / 10**25) * 100) / 100,
        strategy: 'USDC Lending',
      }));
  
      // Process Arbitrum opportunities
      const arbFetchedOpportunities = arbResponse.data.reserves.map((reserve: any) => ({
        chain: 'Arbitrum',
        apy: Math.round((reserve.liquidityRate / 10**25) * 100) / 100,
        strategy: 'USDC Lending',
      }));
  
      // Combine all opportunities into one array
      const allFetchedOpportunities: Opportunity[] = [
        ...ethFetchedOpportunities,
        ...avaxFetchedOpportunities,
        ...arbFetchedOpportunities,
      ];
  
      // Update state with the fetched opportunities
      ethSetOpportunities(allFetchedOpportunities);
      console.log(allFetchedOpportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };
  
  const [opportunities, ethSetOpportunities] = React.useState<Opportunity[]>([]);

  useEffect(() => {

    ethFetchOpportunities();
    const ethInterval = setInterval(() => {
      ethFetchOpportunities();
    }, 48 * 60 * 1000); // 48 minutes in milliseconds

    return () => clearInterval(ethInterval); 
  }, []);


  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Cross-Chain Opportunities</h2>
      {opportunities.map((opportunity, index) => (
      <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{opportunity.chain}</span>
        <span className="text-green-400">{opportunity.apy}% APY</span>
        </div>
        <div className="text-sm text-gray-400">{opportunity.strategy}</div>
        <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded">
        Cross Chain Transfer Now
        </button>
      </div>
      ))}
    </div>
  );
}