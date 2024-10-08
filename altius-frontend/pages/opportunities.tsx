import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { avalanche, arbitrum, ethereum, sepolia, bsc, polygon, avalancheFuji } from "thirdweb/chains";
import { createThirdwebClient, prepareContractCall } from "thirdweb";
import ChainSelector from '../components/ChainSelector';
import TokenSelector from '../components/TokenSelector';
import { aave_rate_query, ethClient } from '../app/theGraphClients';
import Image from 'next/image';

interface Opportunity {
  name: string;
  underlyingAsset: string;
  liquidityRate: number;
  variableBorrowRate: number;
}

interface DataResponse {
  reserves: Opportunity[];
}

const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ''
});

type TradeFormData = {
  destinationChainSelector: string;
  receiver: string;
  token: string;
  amount: string;
};

// Define SVG components for each chain
const PolygonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 33" width="24" height="24" fill="none">
    <path d="M29 10.2a2.8 2.8 0 0 0-2.82 0l-5.71 3.3-3.88 2.23-5.71 3.3a2.8 2.8 0 0 1-2.82 0l-4.47-2.6a2.87 2.87 0 0 1-1.41-2.46V9.03c0-1.02.54-1.96 1.41-2.46l4.4-2.53a2.8 2.8 0 0 1 2.82 0l4.4 2.53A2.87 2.87 0 0 1 16.7 9v5.24l3.88-2.24V6.77c0-1.02-.54-1.96-1.41-2.46l-8.2-4.76a2.8 2.8 0 0 0-2.82 0L0 4.31A2.87 2.87 0 0 0 0 8.93v9.44c0 1.02.54 1.96 1.41 2.46l8.2 4.76a2.8 2.8 0 0 0 2.82 0l5.71-3.3 3.88-2.23 5.71-3.3a2.8 2.8 0 0 1 2.82 0l4.4 2.53c.88.5 1.41 1.44 1.41 2.46v4.94c0 1.02-.54 1.96-1.41 2.46l-4.4 2.53a2.8 2.8 0 0 1-2.82 0l-4.4-2.53a2.87 2.87 0 0 1-1.41-2.46v-5.24l-3.88 2.24v5.24c0 1.02.54 1.96 1.41 2.46l8.28 4.76a2.8 2.8 0 0 0 2.82 0L38 28.69c.88-.5 1.41-1.44 1.41-2.46v-9.44c0-1.02-.54-1.96-1.41-2.46l-8.28-4.76z" fill="#8247E5"/>
  </svg>
);

const SolanaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397.7 311.7" width="24" height="24" fill="none">
    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="#00FFA3"/>
    <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="#00FFA3"/>
    <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="#00FFA3"/>
  </svg>
);

const FantomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="none">
    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#13B5EC"/>
    <path d="M17.2 12.9L19.8 11.4V13.7L17.2 12.9Z" fill="white"/>
    <path d="M19.8 22.7L16 24.7L12.2 22.7V19.4L16 21.4L19.8 19.4V22.7Z" fill="white"/>
    <path d="M16 20.7L19.8 18.7V15.4L17.2 16.9V15.4L16 16.1L12.2 14.1V17.4L16 19.4V20.7Z" fill="white"/>
    <path d="M12.2 11.4L16 9.4L19.8 11.4L16 13.4L12.2 11.4Z" fill="white"/>
    <path d="M14.8 12.9L12.2 11.4V13.7L14.8 12.9Z" fill="white"/>
  </svg>
);

const mockOpportunities = [
  { chain: 'Polygon', apy: 7.2, strategy: 'Liquidity Provision', Icon: PolygonIcon },
  { chain: 'Solana', apy: 8.5, strategy: 'Yield Farming', Icon: SolanaIcon },
  { chain: 'Fantom', apy: 9.1, strategy: 'Staking', Icon: FantomIcon },
]

export default function Opportunities() {
  const { register, handleSubmit, formState: { errors } } = useForm<TradeFormData>();
  const [formData, setFormData] = useState<TradeFormData>({
    destinationChainSelector: '',
    receiver: '',
    token: '',
    amount: ''
  });

  const [sourceChain, setSourceChain] = useState('');
  const [destinationChain, setDestinationChain] = useState('');
  const [selectedToken, setSelectedToken] = useState('');

  const [transactionStatus, setTransactionStatus] = useState('idle');
  const [transactionData, setTransactionData] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  const { chainToUse, contractAddress, destinationChainSelector, token } = useMemo(() => {
    switch (sourceChain) { // Use sourceChain here instead of destinationChain
      case 'ethereum':
        return {
          chainToUse: sepolia,
          contractAddress: '0x0f4C966e4Da1f305C0E1078A0bF90caCc9703002',
          destinationChainSelector: '16015286601757825753',
          token: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
        };
      case 'arbitrum':
        return {
          chainToUse: arbitrum,
          contractAddress: '0x8ee3F523490459d2c424e7b8aD25C5CFb66FA1Ac',
          destinationChainSelector: '3478487238524512106',
          token: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'
        };
      case 'avalanche':
        return {
          chainToUse: avalancheFuji,
          contractAddress: '0x58789ffd83d61753edA4706C57A67Dc8112d32b3',
          destinationChainSelector: '16015286601757825753',
          token: '0x5425890298aed601595a70AB815c96711a31Bc65'
        };
      default:
        return {
          chainToUse: sepolia,
          contractAddress: '0x0f4C966e4Da1f305C0E1078A0bF90caCc9703002',
          destinationChainSelector: '16015286601757825753',
          token: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
        };
    }
  }, [sourceChain]);

  useEffect(() => {
    setFormData(fData => ({
      ...fData,
      destinationChainSelector,
      token: token
    }));
  }, [destinationChain, destinationChainSelector, token]);

  const handleInputChange = (field: keyof TradeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'token') {
      setSelectedToken(value);
    }
  };

  const fetchOpportunities = async () => {
    const response = await ethClient.query(aave_rate_query, { underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }).toPromise();
    console.log('Opportunities:', response.data);
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex mb-8">
        {/* Left half - Cross-Chain Opportunities */}
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-4">Cross-Chain Opportunities</h2>
          {mockOpportunities.map((opportunity, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold flex items-center">
                  <opportunity.Icon />
                  <span className="ml-2">{opportunity.chain}</span>
                </span>
                <span className="text-green-400 font-bold">{opportunity.apy}% APY</span>
              </div>
              <div className="text-sm text-gray-400">{opportunity.strategy}</div>
              <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded">
                Optimize Now
              </button>
            </div>
          ))}
        </div>

        {/* Right half - Transaction Builder */}
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold mb-4">Transaction Builder</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="sourceChain" className="block mb-1">Source Chain</label>
              <ChainSelector value={sourceChain} onChange={setSourceChain} />
            </div>

            <div>
              <label htmlFor="destinationChainSelector" className="block mb-1">Destination Chain Selector</label>
              <ChainSelector value={destinationChain} onChange={setDestinationChain} />
            </div>

            <div>
              <label htmlFor="receiver" className="block mb-1">Receiver Address</label>
              <input
                type="text"
                id="receiver"
                value={formData.receiver}
                onChange={(e) => handleInputChange('receiver', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
            </div>

            <div>
              <label htmlFor="token" className="block mb-1">Token</label>
              <TokenSelector
                value={selectedToken}
                onChange={(value) => handleInputChange('token', value)}
              />
            </div>

            <div>
              <label htmlFor="amount" className="block mb-1">Amount</label>
              <input
                type="text"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
            </div>
          </form>

          <div className="mt-4">
            <TransactionButton
              transaction={() => {
                console.log("FORM DATA:", formData);
                const tx = prepareContractCall({
                  contract: getContract({
                    client: thirdwebClient,
                    chain: chainToUse,
                    address: contractAddress,
                  }),
                  method: "function transferTokensPayNative(uint64 _destinationChainSelector, address _receiver, address _token, uint256 _amount)",
                  params: [
                    BigInt(destinationChainSelector),
                    formData.receiver,
                    formData.token,
                    BigInt(10000)
                  ]
                });
                return tx;
              }}
              onTransactionSent={(result) => {
                console.log("Transaction submitted", result);
                setTransactionStatus('executing');
              }}
              onTransactionConfirmed={(receipt) => {
                console.log("Transaction confirmed", receipt);
                setTransactionStatus('success');
                setTransactionData(receipt);
              }}
              onError={(error) => {
                console.error("Transaction error", error);
                setTransactionStatus('error');
                setTransactionError(error.message);
              }}
            >
              Execute Transaction
            </TransactionButton>
          </div>
        </div>
      </div>

      {/* Transaction Details - Full Width */}
      <div className="w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
        {transactionStatus === 'idle' && (
          <p>No transaction submitted yet.</p>
        )}
        {transactionStatus === 'executing' && (
          <p>Executing transaction...</p>
        )}
        {transactionStatus === 'success' && transactionData && (
          <div>
            <p className="text-green-500">Transaction Successful!</p>
            <pre className="bg-gray-800 p-4 rounded">
              Transaction Hash: <a href={`https://ccip.chain.link/msg/${transactionData.transactionHash}`} target="_blank" rel="noopener noreferrer">
                {transactionData.transactionHash}
              </a>
              {'\n'}From: {transactionData.from}
              {'\n'}To: {transactionData.to}
            </pre>
          </div>
        )}
        {transactionStatus === 'error' && (
          <div>
            <p className="text-red-500">Transaction Failed:</p>
            <pre className="bg-gray-800 p-4 rounded">{transactionError}</pre>
          </div>
        )}
      </div>
    </div>
  );
}