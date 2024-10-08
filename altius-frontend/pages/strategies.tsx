import React, { useState } from 'react';
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { avalancheFuji, sepolia } from "thirdweb/chains";
import { createThirdwebClient, prepareContractCall } from "thirdweb";

const mockStrategies = [
  { name: 'Stable Yield', apy: 5.5, risk: 'Low' },
  { name: 'Balanced Growth', apy: 8.2, risk: 'Medium' },
  { name: 'High Yield', apy: 12.5, risk: 'High' },
];

const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ''
});

export default function Strategies() {
  const [transactionStatus, setTransactionStatus] = useState('idle');
  const [firstTransactionData, setFirstTransactionData] = useState(null);
  const [secondTransactionData, setSecondTransactionData] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  return (
    <div className="container mx-auto mt-8 p-4 flex">
      {/* Strategy Recommendations */}
      <div className="w-1/2 pr-4">
        <h2 className="text-2xl font-bold mb-4">Strategy Recommendations</h2>
        {mockStrategies.map((strategy, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold">{strategy.name}</span>
              <span className="text-green-400 font-bold">{strategy.apy}% APY</span>
            </div>
            <div className="text-sm text-gray-400 mb-3">Risk: {strategy.risk}</div>
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
        <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
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
  );
}