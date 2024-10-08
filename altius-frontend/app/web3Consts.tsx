// constants.ts

export const CCIP_CHAIN_SELECTORS = {
    ETH_SEPOLIA: '16015286601757825753',
    AVAX_FUJI: '14767482510784806043',
    ARBITRUM_SEPOLIA: '3478487238524512106',
};

// API URLs
export const API_URLS = {
    ETH: 'https://api.etherscan.io/api',
    AVAX: 'https://api.avax.network/ext/bc/C/rpc',
    ARBITRUM: 'https://rpc.arbitrum.io/rpc',
};

export const USDC_ADDRESS = {
    ETH_SEPOLIA: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    AVAX_FUJI: '0x5425890298aed601595a70AB815c96711a31Bc65',
    ARBITRUM_SEPOLIA: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
}
  
// Contract Addresses
export const CONTRACT_ADDRESSES = {
    STRATEGY_VAULT_AVAX: '0xce9FaC7404644Ec038190Bb77bfDDB442C2EDFB1',
    STRATEGY_VAULT_SEPOLIA: '0x7647e7d7fe325f1Ca8F66eCa0D00e6a99cbFad75',
    STRATEGY_VAULT_ARBITRUM_SEPOLIA: '0xaD4D3C1E52d4b5029184Bc58Ad96CCC0Aa6D1757',
};

export const CCIP_TRANSFER_ABI = [
    "function transferTokensPayNative(uint64 _destinationChainSelector, address _receiver, address _token, uint256 _amount) external returns (bytes32)"
];

export const ALTIUS_DEV_WALLET = {
    ADDRESS: '0x66eB3445eE0A50BC9f697dbE891768679599fb1d',
    PRIVATE_KEY: 'e072f4f2bb39293db7f29f3f7cb0e1654240d9730840bb8441ac33bfde030640',
}

export const TESTNET_EXPLORERS_TXN_ENDPOINTS = {
    AVAX: 'https://testnet.avascan.info/blockchain/c/tx/',
    ETH: 'https://sepolia.etherscan.io/tx/',
    ARBITRUM: 'https://sepolia.arbiscan.io/tx/',
}

// Other Constants
export const DECIMALS = {
USDC: 6,
ETH: 18,
AVAX: 18,
};
  
// Strategies
export const STRATEGIES = {
USDC_LENDING: 'USDC Lending',
ETH_LENDING: 'ETH Lending',
};
  