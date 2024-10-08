const hre = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const s_router = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; 
    const s_linkToken = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"; 
    const tokenTransferor = await hre.ethers.deployContract("TokenTransferor_v1",[s_router, s_linkToken]);
    await tokenTransferor.waitForDeployment();

    console.log("TokenTransferor_v1 contract address:", tokenTransferor.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });