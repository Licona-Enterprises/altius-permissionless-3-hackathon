import React, { useEffect } from 'react';
import { aave_rate_query, ethClient, avaxClient, arbitrumClient } from '../app/theGraphClients';


const mockStrategies = [
  { name: 'Stable Yield', apy: 5.5, risk: 'Low' },
  { name: 'Balanced Growth', apy: 8.2, risk: 'Medium' },
  { name: 'High Yield', apy: 12.5, risk: 'High' },
]

type Opportunity = {
  chain: string;
  apy: number;
  strategy: string;
};

export default function Strategies() {

  const evmFetchOpportunities = async () => {
    try {
      // Fetch Ethereum, Avalanche, and Arbitrum opportunities concurrently
      const [ethResponse, avaxResponse, arbResponse] = await Promise.all([
        ethClient.query(aave_rate_query, { underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }).toPromise(),
        avaxClient.query(aave_rate_query, { underlyingAsset: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E' }).toPromise(),
        arbitrumClient.query(aave_rate_query, { underlyingAsset: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' }).toPromise(),
      ]);
  
      // Process Ethereum opportunities
      const ethFetchedOpportunities = ethResponse.data.reserves.map((reserve: any) => ({
        chain: '16015286601757825753',
        apy: Math.round((reserve.liquidityRate / 10 ** 25) * 100) / 100,
        strategy: 'Latter Day Lending',
      }));
  
      // Process Avalanche opportunities
      const avaxFetchedOpportunities = avaxResponse.data.reserves.map((reserve: any) => ({
        chain: '14767482510784806043',
        apy: Math.round((reserve.liquidityRate / 10 ** 25) * 100) / 100,
        strategy: 'Latter Day Lending',
      }));
  
      // Process Arbitrum opportunities
      const arbFetchedOpportunities = arbResponse.data.reserves.map((reserve: any) => ({
        chain: '3478487238524512106',
        apy: Math.round((reserve.liquidityRate / 10 ** 25) * 100) / 100,
        strategy: 'Latter Day Lending',
      }));
  
      // Combine all opportunities into one array
      const allFetchedOpportunities: Opportunity[] = [
        ...ethFetchedOpportunities,
        ...avaxFetchedOpportunities,
        ...arbFetchedOpportunities,
      ];
  
      // Find the opportunity with the highest APY
      const highestApyOpportunity = allFetchedOpportunities.reduce((max, current) =>
        current.apy > max.apy ? current : max
      , allFetchedOpportunities[0]);
  
      console.log('Opportunity with the highest APY:', highestApyOpportunity);
  
      // Create a new array with only the chain, apy, and strategy of the highest APY opportunity
      const highestApyData = {
        chain: highestApyOpportunity.chain,
        apy: highestApyOpportunity.apy,
        strategy: highestApyOpportunity.strategy,
      };
  
      // Append the highest APY opportunity to the array
      const allFetchedOpportunitiesWithHighest: Opportunity[] = [
        highestApyData,  // Add only chain, apy, and strategy
      ];
  
      // Update state with the fetched opportunities including the highest APY data
      evmSetOpportunities(allFetchedOpportunitiesWithHighest);
      console.log(allFetchedOpportunitiesWithHighest);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const [opportunities, evmSetOpportunities] = React.useState<Opportunity[]>([]);

  
  useEffect(() => {

    evmFetchOpportunities();
    const ethInterval = setInterval(() => {
      evmFetchOpportunities();
    }, 30 * 60 * 1000); // 48 minutes in milliseconds

    return () => clearInterval(ethInterval); 
  }, []);


  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Strategy Recommendations</h2>
      {opportunities.map((opportunity, index) => (
      <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{opportunity.strategy}</span>
        <span className="text-green-400">{opportunity.apy}% APY</span>
        </div>
        <div className="text-sm text-gray-400">Current Strategy ID: {opportunity.chain}</div>
        <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded">
        Execute
        </button>
      </div>
      ))}
    </div>
  )
}
