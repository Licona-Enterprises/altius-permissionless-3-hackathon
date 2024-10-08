import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { avalanche, arbitrum, ethereum, sepolia, bsc, polygon, avalancheFuji } from "thirdweb/chains";
import { createThirdwebClient, prepareContractCall } from "thirdweb";
import { toWei } from "thirdweb/utils";
import ChainSelector from '../components/ChainSelector';
import TokenSelector from '../components/TokenSelector';

const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ''
});

type TradeFormData = {
  destinationChainSelector: string;
  receiver: string;
  token: string;
  amount: string;
};

export default function Trade() {
  const { register, handleSubmit, formState: { errors } } = useForm<TradeFormData>();
  const [formData, setFormData] = useState<TradeFormData>({
    destinationChainSelector: '16015286601757825753', // Default destination chain selector
    receiver: '',
    token: '0x0f4C966e4Da1f305C0E1078A0bF90caCc9703002', // Default to USDC
    amount: ''
  });

  const [sourceChain, setSourceChain] = useState('sepolia');
  const [destinationChain, setDestinationChain] = useState('sepolia');
  const [selectedToken, setSelectedToken] = useState('0x0f4C966e4Da1f305C0E1078A0bF90caCc9703002'); // Default to USDC

  const [transactionStatus, setTransactionStatus] = useState('idle'); // 'idle', 'executing', 'success', 'error'
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
  }, [sourceChain]); // Depend on sourceChain
  

  useEffect(() => {
    setFormData(fData => ({
      ...fData,
      destinationChainSelector,
      token: token // This updates token in formData as well
    }));
  }, [destinationChain, destinationChainSelector, token]);

  const handleInputChange = (field: keyof TradeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'token') {
      setSelectedToken(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trade</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
          <h2 className="text-2xl font-bold mb-4">Transaction Builder</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="sourceChain" className="block mb-1">Source Chain</label>
              <ChainSelector value={sourceChain} onChange={setSourceChain} />
              {errors.sourceChain && <p className="text-red-500">{errors.sourceChain.message}</p>}
            </div>

            <div>
              <label htmlFor="destinationChainSelector" className="block mb-1">Destination Chain Selector</label>
              <ChainSelector value={destinationChain} onChange={setDestinationChain} />
              {errors.destinationChainSelector && <p className="text-red-500">{errors.destinationChainSelector.message}</p>}
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
              {errors.receiver && <p className="text-red-500">{errors.receiver.message}</p>}
            </div>

            <div>
              <label htmlFor="token" className="block mb-1">Token</label>
              <TokenSelector
                value={selectedToken}
                onChange={(value) => handleInputChange('token', value)}
              />
              {errors.token && <p className="text-red-500">{errors.token.message}</p>}
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
              {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
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
                    BigInt(10000) // temporarily set to 0.01 USDC for testing
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

        <div className="w-full md:w-1/2 px-4">
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
    </div>
  );
}
