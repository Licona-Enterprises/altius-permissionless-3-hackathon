import React, { useState } from 'react';
import { useEffect } from 'react';
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { avalancheFuji, sepolia } from "thirdweb/chains";
import { createThirdwebClient, prepareContractCall } from "thirdweb";
import { aave_rate_query, ethClient, avaxClient, arbitrumClient } from '../app/theGraphClients';


interface Reserve {
  liquidityRate: number;
  // Add other fields as necessary based on the structure of the data returned
}

const mockStrategies = [
  { name: 'Stable Yield', apy: 5.5, risk: 'Low' },
  { name: 'Balanced Growth', apy: 8.2, risk: 'Medium' },
  { name: 'High Yield', apy: 12.5, risk: 'High' },
]

const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ''
});

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
      const ethFetchedOpportunities = ethResponse.data.reserves.map((reserve: Reserve) => ({
        chain: '16015286601757825753',
        apy: Math.round((reserve.liquidityRate / 10 ** 25) * 100) / 100,
        strategy: 'Latter Day Lending',
      }));
  
      // Process Avalanche opportunities
      const avaxFetchedOpportunities = avaxResponse.data.reserves.map((reserve: Reserve) => ({
        chain: '14767482510784806043',
        apy: Math.round((reserve.liquidityRate / 10 ** 25) * 100) / 100,
        strategy: 'Latter Day Lending',
      }));
  
      // Process Arbitrum opportunities
      const arbFetchedOpportunities = arbResponse.data.reserves.map((reserve: Reserve) => ({
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

  const [transactionStatus, setTransactionStatus] = useState('idle');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [firstTransactionData, setFirstTransactionData] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [secondTransactionData, setSecondTransactionData] = useState<any>(null);
  const [transactionError, setTransactionError] = useState<string>('');

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto mt-8 p-4">
        <div className="flex">
          {/* Strategy Recommendations */}
          <div className="w-1/2 pr-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Strategy Recommendations</h2>
            {opportunities.map((opportunity, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{opportunity.strategy}</span>
                  <span className="text-green-400 font-bold">{opportunity.apy}% APY</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">Current Strategy ID: {opportunity.chain}</div>
                <TransactionButton
                  transaction={() => {
                    const tx = prepareContractCall({
                      contract: getContract({
                        client: thirdwebClient,
                        chain: avalancheFuji,
                        address: '0x58789ffd83d61753edA4706C57A67Dc8112d32b3', // avalanche fuji contract address
                      }),
                      method: "function transferTokensPayNative(uint64 _destinationChainSelector, address _receiver, address _token, uint256 _amount)",
                      params: [
                        BigInt('16015286601757825753'), // avalanche fuji chain selector
                        '0x66eB3445eE0A50BC9f697dbE891768679599fb1d', // our wallet address
                        '0x5425890298aed601595a70AB815c96711a31Bc65', // USDC token address on avalanche fuji
                        BigInt(10000) // 0.01 USDC
                      ]
                    });
                    return tx;
                  }}
                  onTransactionSent={(firstResult) => {
                    console.log("Transaction submitted", firstResult);
                    setTransactionStatus('executing_first');
                  }}
                  onTransactionConfirmed={(receipt) => {
                    setTransactionStatus('executing_second');
                    console.log("first contract succeeded, executing second...");
                    prepareContractCall({
                      contract: getContract({
                        client: thirdwebClient,
                        chain: avalancheFuji,
                        address: '0xce9FaC7404644Ec038190Bb77bfDDB442C2EDFB1', // avalanche fuji contract address
                      }),
                      method: "function transferTokensPayNative(uint64 _destinationChainSelector, address _receiver, address _token, uint256 _amount)",
                      params: [
                        BigInt('16015286601757825753'), // avalanche fuji chain selector
                        '0x66eB3445eE0A50BC9f697dbE891768679599fb1d', // our wallet address
                        '0x5425890298aed601595a70AB815c96711a31Bc65', // USDC token address on avalanche fuji
                        BigInt(10000) // 0.01 USDC
                      ]
                    });
                    console.log("Transaction confirmed", receipt);
                    setTransactionStatus('success');
                    setSecondTransactionData(receipt);
                  }}
                  onError={(error) => {
                    console.error("Transaction error", error);
                    setTransactionStatus('error');
                    setTransactionError(error.message);
                  }}
                >
                  Execute Strategy
                </TransactionButton>
              </div>
            ))}
          </div>

          {/* Transaction Details */}
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Transaction Details</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              {transactionStatus === 'idle' && (
                <p className="text-gray-400">Select a strategy to execute and view transaction details.</p>
              )}
              {transactionStatus === 'executing_first' && (
                <p className="text-yellow-400">Executing token transfer...</p>
              )}
              {(transactionStatus === 'executing_second' || transactionStatus === 'success') && firstTransactionData && (
                <div className="mb-4">
                  <p className="text-green-500 mb-2">Token Transfer Successful!</p>
                  <a href={`https://ccip.chain.link/tx/${firstTransactionData.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    View transaction on CCIP Explorer
                  </a>
                </div>
              )}
              {transactionStatus === 'executing_second' && (
                <p className="text-yellow-400">Executing strategy...</p>
              )}
              {transactionStatus === 'success' && secondTransactionData && (
                <div>
                  <p className="text-green-500 mb-2">Strategy Execution Successful!</p>
                  <pre className="bg-gray-800 p-4 rounded text-sm mb-4">
                    Transaction Hash: {secondTransactionData.transactionHash.length > 39
                                        ? `${secondTransactionData.transactionHash.slice(0, 39)}...`
                                        : secondTransactionData.transactionHash}
                    {'\n'}From: {secondTransactionData.from}
                    {'\n'}To: {secondTransactionData.to}
                  </pre>
                  <a href={`https://ccip.chain.link/tx/${secondTransactionData.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    View transaction on CCIP Explorer
                  </a>
                </div>
              )}
              {transactionStatus === 'error' && (
                <div>
                  <p className="text-red-500 mb-2">Transaction Failed:</p>
                  <pre className="bg-gray-800 p-4 rounded text-sm">{transactionError}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}