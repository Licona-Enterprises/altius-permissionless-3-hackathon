import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { avalanche, ethereum, bsc, polygon, arbitrum } from "thirdweb/chains";
import { createThirdwebClient, prepareContractCall } from "thirdweb";
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
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TradeFormData>();
  const [formData, setFormData] = useState<TradeFormData | null>(null);
  const [destinationChain, setDestinationChain] = useState('ethereum');
  const [selectedToken, setSelectedToken] = useState('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'); // USDC address as default

  // Use useMemo to derive chainToUse and contractAddress from destinationChain
  const { chainToUse, contractAddress } = useMemo(() => {
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
          chainToUse: avalanche,
          contractAddress: '0x67E93C4b89Dd330d7b8B9f6D455210AEA5605CE1',
          destinationChainSelector: '14767482510784806043',
          token: '0x5425890298aed601595a70AB815c96711a31Bc65'
        };

      case 'binance':
        return {
          chainToUse: bsc,
          contractAddress: '',
          destinationChainSelector: 0,
          token: ''
        };
      case 'polygon':
        return {
          chainToUse: polygon,
          contractAddress:'0xYourPolygonContractAddress',
          destinationChainSelector: 0,
          token: ''
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

  const onSubmit = (data: TradeFormData) => {
    setFormData({ ...data, token: selectedToken });
    console.log('Form data:', { ...data, token: selectedToken });
  };

  // Update the token value when it changes
  const handleTokenChange = (value: string) => {
    setSelectedToken(value);
    setValue('token', value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trade</h1>
      <div className="flex flex-wrap -mx-4">
        {/* Left half: Transaction Builder */}
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
          <h2 className="text-2xl font-bold mb-4">Transaction Builder</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {...register("receiver", { required: "This field is required" })}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
              {errors.receiver && <p className="text-red-500">{errors.receiver.message}</p>}
            </div>

            <div>
              <label htmlFor="token" className="block mb-1">Token</label>
              <TokenSelector value={selectedToken} onChange={handleTokenChange} />
            </div>

            <div>
              <label htmlFor="amount" className="block mb-1">Amount</label>
              <input
                type="text"
                id="amount"
                {...register("amount", { required: "This field is required" })}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
              {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
            </div>
          </form>

          <div className="mt-4">
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: getContract({
                    client: thirdwebClient,
                    chain: chainToUse,
                    address: contractAddress,
                  }),
                  method: "function transferTokensPayNative(uint64 _destinationChainSelector, address _receiver, address _token, uint256 _amount)",
                  params: [
                    BigInt(formData?.destinationChainSelector || 0),
                    formData?.receiver || '',
                    formData?.token || '',
                    BigInt(0.01) // hard code as small amount for testing
                  ]
                })
              }
              payModal={false} // Disable the FIAT on-ramp dialogue (optional)
            >
              Execute Transaction
            </TransactionButton>
          </div>
        </div>

        {/* Right half: Submitted Data or other content */}
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