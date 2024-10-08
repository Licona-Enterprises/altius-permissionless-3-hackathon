import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { avalanche, arbitrum, ethereum, sepolia, bsc, polygon, avalancheFuji } from "thirdweb/chains";
import { createThirdwebClient, prepareContractCall } from "thirdweb";
import ChainSelector from '../components/ChainSelector';
import TokenSelector from '../components/TokenSelector';
import { aave_rate_query, ethClient, avaxClient, arbitrumClient } from '../app/theGraphClients';
import Image from 'next/image';


interface Reserve {
  liquidityRate: number;
  // Add other fields as necessary based on the structure of the data returned
}


// interface Opportunity {
//   name: string;
//   underlyingAsset: string;
//   liquidityRate: number;
//   variableBorrowRate: number;
// }

type Opportunity = {
  chain: string;
  apy: number;
  strategy: string;
  Icon: React.FC; // Add the Icon property
};

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
const EthereumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
        <path d="M16.498 4L9 16.22l7.498-3.35z"/>
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/>
        <path d="M16.498 27.995v-6.028L9 17.616z"/>
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/>
      </g>
    </g>
  </svg>
);

const AvalancheIcon = () => (
  <svg width="20" height="20" viewBox="0 0 1503 1504" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="287" y="258" width="928" height="844" fill="white"/>
    <path d="M714.163 345.75H583.327L362.023 784.224H510.915L714.163 345.75Z" fill="#E84142"/>
    <path d="M1140.52 784.224L1010.91 544.143L925.87 784.224H1140.52Z" fill="#E84142"/>
    <path d="M714.163 345.75L925.87 784.224H510.915L714.163 345.75Z" fill="#E84142"/>
    <path d="M362.023 784.224L583.327 1222.7H714.163L510.915 784.224H362.023Z" fill="#E84142"/>
    <path d="M925.87 784.224H1140.52L919.218 1222.7H788.381L925.87 784.224Z" fill="#E84142"/>
    <path d="M788.381 1222.7H919.218L1140.52 784.224H925.87L788.381 1222.7Z" fill="#E84142"/>
  </svg>
);

const ArbitrumIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#2D374B"/>
    <path d="M16.4609 15.0937L12.1981 6.89058C12.0638 6.62116 11.7638 6.62116 11.6294 6.89058L7.36663 15.0937C7.25288 15.3235 7.41913 15.5906 7.67413 15.5906H9.84538C9.98288 15.5906 10.1079 15.5203 10.1711 15.4031L12.0056 11.7844C12.0688 11.6672 12.2719 11.6672 12.3352 11.7844L14.1697 15.4031C14.2329 15.5203 14.3579 15.5906 14.4954 15.5906H16.1534C16.4084 15.5906 16.5747 15.3235 16.4609 15.0937Z" fill="white"/>
  </svg>
);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactionData, setTransactionData] = useState<any>(null);
  const [transactionError, setTransactionError] = useState<string>('');

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
        chain: 'Ethereum Sepolia',
        apy: Math.round((reserve.liquidityRate / 10**25) * 100) / 100,
        strategy: 'USDC Lending',
        Icon: EthereumIcon
      }));
  
      // Process Avalanche opportunities
      const avaxFetchedOpportunities = avaxResponse.data.reserves.map((reserve: Reserve) => ({
        chain: 'Avalanche Fuji',
        apy: Math.round((reserve.liquidityRate / 10**25) * 100) / 100,
        strategy: 'USDC Lending',
        Icon: AvalancheIcon
      }));
  
      // Process Arbitrum opportunities
      const arbFetchedOpportunities = arbResponse.data.reserves.map((reserve: Reserve) => ({
        chain: 'Arbitrum',
        apy: Math.round((reserve.liquidityRate / 10**25) * 100) / 100,
        strategy: 'USDC Lending',
        Icon: ArbitrumIcon
      }));
  
      // Combine all opportunities into one array
      const allFetchedOpportunities: Opportunity[] = [
        ...ethFetchedOpportunities,
        ...avaxFetchedOpportunities,
        ...arbFetchedOpportunities,
      ];
  
      // Update state with the fetched opportunities
      ethSetOpportunities(allFetchedOpportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };
  
  const [opportunities, ethSetOpportunities] = React.useState<Opportunity[]>([]);

  useEffect(() => {

    evmFetchOpportunities();
    const ethInterval = setInterval(() => {
      evmFetchOpportunities();
    }, 48 * 60 * 1000); // 48 minutes in milliseconds

    return () => clearInterval(ethInterval); 
  }, []);


  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex mb-8">
        {/* Left half - Cross-Chain Opportunities */}
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-4 text-blue-300">Cross-Chain Opportunities</h2>
          {opportunities.map((opportunity, index) => (
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
          <h2 className="text-2xl font-bold mb-4 text-blue-300">Transaction Builder</h2>
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
              onError={(error: Error) => {
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
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Transaction Details</h2>
        {transactionStatus === 'idle' && (
          <p>No transaction submitted yet.</p>
        )}
        {transactionStatus === 'executing' && (
          <p>Executing transaction...</p>
        )}
        {transactionStatus === 'success' && transactionData && (
          <div>
            <p className="text-green-500">Transaction Successful!</p>
            <pre className="bg-gray-800 p-4 rounded text-sm mb-4">
              Transaction Hash: {transactionData.transactionHash.length > 39
                                  ? `${transactionData.transactionHash.slice(0, 39)}...`
                                  : transactionData.transactionHash}
              {'\n'}From: {transactionData.from}
              {'\n'}To: {transactionData.to}
            </pre>
            <a href={`https://ccip.chain.link/tx/${transactionData.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              View transaction on CCIP Explorer
            </a>
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