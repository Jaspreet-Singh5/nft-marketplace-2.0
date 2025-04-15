const { ethers } = require('ethers');
require('dotenv').config();
const NFT_CONTRACT_ABI = require('../abis/NFT.json');

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;
const RPC_URL = process.env.ETHEREUM_RPC_URL;

// Initialize provider and signer
const getContractInstance = () => {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, wallet);

        return { nftContract, provider, wallet };
    } catch (error) {
        console.error('Failed to initialize contract instance:', error);
        throw new Error('Contract initialization failed');
    }
};

// Mint NFT on blockchain
const mintNFT = async (toAddress, metadataURI) => {
    try {
        const { nftContract } = getContractInstance();

        // Convert IPFS hash to proper URI format if needed
        const tokenURI = metadataURI.startsWith('ipfs://') ? metadataURI : `ipfs://${metadataURI}`;

        // Call the createNft function on the smart contract
        const tx = await nftContract.createNft(toAddress, tokenURI);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Extract token ID from transaction logs
        const tokenId = parseInt(receipt.logs[0].topics[3], 16);

        return {
            success: true,
            tokenId,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
        };
    } catch (error) {
        console.error('Contract minting failed:', error);
        throw new Error(`NFT minting failed: ${error.message}`);
    }
};

// Get NFT ownership data from blockchain
const getNFTData = async tokenId => {
    try {
        const { nftContract } = getContractInstance();

        // Get owner of the token
        const owner = await nftContract.ownerOf(tokenId);

        // Get token URI
        const tokenURI = await nftContract.tokenURI(tokenId);

        return {
            tokenId,
            owner,
            tokenURI,
        };
    } catch (error) {
        console.error('Failed to get NFT data:', error);
        throw new Error(`Failed to retrieve NFT data: ${error.message}`);
    }
};

module.exports = {
    mintNFT,
    getNFTData,
};
