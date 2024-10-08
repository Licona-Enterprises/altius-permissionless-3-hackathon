import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { avalanche, arbitrum, ethereum, bsc, polygon, avalancheFuji } from "thirdweb/chains";
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
    token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Default to USDC
    amount: ''
  });
  const [destinationChain, setDestinationChain] = useState('ethereum');
  const [selectedToken, setSelectedToken] = useState('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'); // Default to USDC

  const { chainToUse, contractAddress, destinationChainSelector, token } = useMemo(() => {
    switch (destinationChain) {
      case 'ethereum':
        return {
          chainToUse: ethereum,
          contractAddress: '0x689688cA66D3357Ab096E205Ea9C8B094366890d',
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
          contractAddress: '0x67E93C4b89Dd330d7b8B9f6D455210AEA5605CE1',
          destinationChainSelector: '14767482510784806043',
          token: '0x5425890298aed601595a70AB815c96711a31Bc65'
        };
      default:
        return {
          chainToUse: ethereum,
          contractAddress: '0x689688cA66D3357Ab096E205Ea9C8B094366890d',
          destinationChainSelector: '16015286601757825753',
          token: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
        };
    }
  }, [destinationChain]);

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
                    formData.amount ? toWei(formData.amount) : toWei('0.01') // Use form data or default
                  ]
                });
                return tx;
              }}
              onTransactionSent={(result) => {
                console.log("Transaction submitted", result);
              }}
              onTransactionConfirmed={(receipt) => {
                console.log("Transaction confirmed", receipt);
              }}
              onError={(error) => {
                console.error("Transaction error", error);
              }}
            >
              Execute Transaction
            </TransactionButton>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-4">
          <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
          {formData ? (
            <pre className="bg-gray-800 p-4 rounded">
              {JSON.stringify(formData, null, 2)}
            </pre>
          ) : (
            <p>No transaction submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
