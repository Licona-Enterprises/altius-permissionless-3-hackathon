import { JsonRpcProvider } from 'ethers';

// Connect to the Ethereum network
const provider = new JsonRpcProvider("https://shape-mainnet.g.alchemy.com/v2/_SKV1jAhZpOpH4iT-vij4mcVLZQUh28E");

// Get block by number
const blockNumber = "latest";
const block = await provider.getBlock(blockNumber);

console.log(block);