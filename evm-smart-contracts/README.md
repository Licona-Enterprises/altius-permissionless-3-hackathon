# Deployed Contract Addresses

This section contains the addresses where the TokenTransferor_v1 contract is deployed on various blockchain networks. 

| Network    | Contract Address                                    | Explorer Link                                     |
|------------|------------------------------------------------------|---------------------------------------------------|
| Ethereum Sepolia   | `0x0f4C966e4Da1f305C0E1078A0bF90caCc9703002`                      | [View on Etherscan](https://sepolia.etherscan.io/address/0x0f4C966e4Da1f305C0E1078A0bF90caCc9703002) |
| Arbitrum Sepolia | `0xA6799504091F9e8FAF1475D6e75373061E80F1cC`                   | [View on Arbscan](https://sepolia.arbiscan.io/address/0xA6799504091F9e8FAF1475D6e75373061E80F1cC) |
| Avalanche Fuji  | `0x58789ffd83d61753edA4706C57A67Dc8112d32b3`                     | [View on Avascan](https://testnet.avascan.info/blockchain/all/address/0x58789ffd83d61753edA4706C57A67Dc8112d32b3) |

Here is the updated README that includes the supported assets and the updated function signature for `transferTokensPayNative`, as well as the destination chain selectors.

# Cross-Chain ERC20 Token Transfer Contracts

## Overview

This project consists of smart contracts deployed across multiple networks to enable seamless cross-chain transfers of ERC20 tokens. Each contract allows users to send ERC20 tokens to any address across the following supported networks:

- **Avalanche Fuji Testnet**
- **Ethereum Sepolia Testnet**
- **Arbitrum Sepolia Testnet**

### Deployed Contracts

| Network           | Contract Address                                    | Allowlisted Networks                        | Supported Assets                          |
|-------------------|-----------------------------------------------------|---------------------------------------------|-------------------------------------------|
| Avalanche Fuji     | `0x58789ffd83d61753edA4706C57A67Dc8112d32b3`        | Ethereum Sepolia, Arbitrum Sepolia          | USDC: `0x5425890298aed601595a70AB815c96711a31Bc65` |
| Ethereum Sepolia   | `0x0f4C966e4Da1f305C0E1078A0bF90caCc9703002`        | Avalanche Fuji, Arbitrum Sepolia            | USDC: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |
| Arbitrum Sepolia   | `0xA6799504091F9e8FAF1475D6e75373061E80F1cC`        | Avalanche Fuji, Ethereum Sepolia            | USDC: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d`  |

### Supported Chains and Selectors

To perform cross-chain token transfers, the following destination chain selectors can be used to identify the network to which tokens will be sent:

| Chain             | Selector ID                   |
|-------------------|-------------------------------|
| Avalanche Fuji     | `14767482510784806043`        |
| Ethereum Sepolia   | `16015286601757825753`        |
| Arbitrum Sepolia   | `3478487238524512106`         |

### Features

- **Cross-Chain Transfers:** These contracts allow users to send ERC20 tokens from one chain to another by leveraging allowlisted networks. Each contract has been configured to support seamless transfers between the deployed networks.
  
- **Permissioned Transfers:** The contract has a permissioned mechanism to ensure that only allowlisted chains can interact with the deployed contracts for token transfers.

- **Supported Assets:** Each network supports the transfer of USDC tokens, with the contract able to send tokens between chains listed in the allowlist.

### Usage

#### Sending ERC20 Tokens to a Cross-Chain Address

To send ERC20 tokens across different chains, you can use the `transferTokensPayNative` function. This function initiates the transfer of tokens from the current network to a designated address on an allowlisted network, specifying the destination chain, the receiver, and the amount.

Here is the function signature:
```solidity
function transferTokensPayNative(
    uint64 _destinationChainSelector, 
    address _receiver, 
    address _token, 
    uint256 _amount
) external payable;
```

Here’s an example using Ethers.js:

```javascript
const { ethers } = require('ethers');

// Replace with appropriate values
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';
const DESTINATION_CHAIN_SELECTOR = 14767482510784806043; // Example: Avalanche Fuji
const RECIPIENT_ADDRESS = 'RECIPIENT_ADDRESS_ON_OTHER_CHAIN';
const TOKEN_ADDRESS = 'USDC_TOKEN_ADDRESS_ON_CURRENT_CHAIN'; // Use the supported USDC token address
const TOKEN_AMOUNT = ethers.utils.parseUnits('100', 6); // Example: 100 USDC tokens (with 6 decimals)

// Contract ABI
const abi = [
  "function transferTokensPayNative(uint64 _destinationChainSelector, address _receiver, address _token, uint256 _amount) external payable"
];

// Provider and Signer
const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_PROVIDER');
const signer = provider.getSigner(); // Replace with wallet or private key signer

// Instantiate contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

async function transferTokens() {
  try {
    const tx = await contract.transferTokensPayNative(
      DESTINATION_CHAIN_SELECTOR,
      RECIPIENT_ADDRESS,
      TOKEN_ADDRESS,
      TOKEN_AMOUNT,
      { value: ethers.utils.parseEther('0.01') } // Native token fee (e.g., ETH/AVAX)
    );
    console.log('Transaction sent:', tx.hash);
    await tx.wait();
    console.log('Transaction confirmed!');
  } catch (err) {
    console.error('Error during transfer:', err);
  }
}

transferTokens();
```

### Requirements

- Solidity ^0.8.x
- Hardhat
- Ethers.js



# Strategy Vaults

The Strategy Vaults are designed to optimize and manage yield generation across multiple blockchain networks, specifically Avalanche, Ethereum Sepolia, and Arbitrum. Each vault is owned by the Altius protocol and is responsible for rebalancing funds to ensure users achieve the best possible yield on their assets.

## Addresses

Below are the deployed addresses for the Strategy Vaults across different networks:

- **Avalanche Fuji:**  
  `0xce9FaC7404644Ec038190Bb77bfDDB442C2EDFB1`

- **Ethereum Sepolia:**  
  `0x7647e7d7fe325f1Ca8F66eCa0D00e6a99cbFad75`

- **Arbitrum Sepolia:**  
  `0xaD4D3C1E52d4b5029184Bc58Ad96CCC0Aa6D1757`

## Functionality

The Strategy Vaults provide the following features:

- **Yield Optimization:** Automatically rebalances assets to ensure the best yield is achieved across various DeFi protocols.
- **Cross-Chain Support:** Operates across multiple blockchain networks, leveraging unique opportunities in each ecosystem.
- **User-Friendly:** Designed to be easily integrated into existing applications, allowing users to manage their assets effectively.

## Deployment

### Prerequisites

- Node.js
- Hardhat
- Ethers.js

## How to Use

1. **Connect your wallet**: Make sure to connect your wallet that contains the assets you want to deposit into the Strategy Vault.
   
2. **Deposit Funds**: Use the appropriate function in the contract to deposit funds into the vault.

3. **Monitor Performance**: Keep track of your investments and monitor the yield generated by the vault.

4. **Withdraw Funds**: You can withdraw your funds at any time, with yields being automatically calculated.

