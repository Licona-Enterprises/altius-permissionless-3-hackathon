// Import Hardhat runtime environment and ethers
const { ethers } = require("hardhat");

async function main() {
  // Set up provider and wallet
  // const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
  const provider = ethers.JsonRpcApiProvider('https://api.avax-test.network/ext/bc/C/rpc');

  const privateKey = 'e072f4f2bb39293db7f29f3f7cb0e1654240d9730840bb8441ac33bfde030640'; // Use environment variable in production
  const wallet = new ethers.Wallet(privateKey, provider);

  const contractAddress = '0xce9FaC7404644Ec038190Bb77bfDDB442C2EDFB1';

  const abi = [
    "function transferTokensPayNative(uint64 _destinationChainSelector, address _receiver, address _token, uint256 _amount) external returns (bytes32)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Function to transfer tokens
  async function transferTokensPayNative(destinationChainSelector, receiver, token, amount) {
    try {
      const amountInWei = ethers.utils.parseUnits(amount.toString(), 6); // Assuming 6 decimals for token

      const tx = await contract.transferTokensPayNative(
        destinationChainSelector,
        receiver, // Receiver's address
        token, // Token address (e.g., USDC on Avalanche)
        amountInWei // Amount in wei
      );

      // Wait for the transaction to be mined
      console.log('Transaction sent. Waiting for confirmation...');
      const receipt = await tx.wait();

      // Log the transaction hash and receipt
      console.log('Transaction confirmed:', receipt.transactionHash);
      console.log('Message ID:', receipt.events[0].args.messageId); // Assuming the event is emitted at index 0
    } catch (error) {
      console.error('Error during transaction:', error);
    }
  }

  // Example parameters for the function call
  const destinationChainSelector = 16015286601757825753n; // Example chain selector for Avalanche Fuji
  const receiverAddress = '0x7647e7d7fe325f1Ca8F66eCa0D00e6a99cbFad75'; // Replace with actual receiver address
  const tokenAddress = '0x5425890298aed601595a70AB815c96711a31Bc65'; 
  const amount = 1; // Amount in tokens (before converting to wei)

  // Execute the function
  await transferTokensPayNative(destinationChainSelector, receiverAddress, tokenAddress, amount);
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
