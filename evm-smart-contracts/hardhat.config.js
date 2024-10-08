require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports.networks = {
  solidity: "0.8.27",
  sepolia: {
    url: "https://eth-sepolia.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY",
    accounts: [`0x${YOUR_PRIVATE_KEY}`]
  },
  fuji: {
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    accounts: [`0x${YOUR_PRIVATE_KEY}`]
  },
  arbitrumSepolia: {
    url: "https://arb-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY",
    accounts: [`0x${YOUR_PRIVATE_KEY}`]
  }
};