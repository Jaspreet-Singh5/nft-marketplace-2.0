// Import required dependencies
const express = require('express');
const multer = require('multer');
const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const upload = multer();
const { PinataSDK } = require('pinata');
const { NFT_ABI } = require('../abis/NFT');
require('dotenv').config();

// Initialize Pinata SDK for IPFS interactions
const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGatewayKey: process.env.PINATA_GATEWAY_URL,
});

const router = express.Router();

// Setup Ethereum provider and contract instance
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const nft = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
// Initialize signer for transaction signing using private key
const signer = new ethers.Wallet(process.env.MINTER_PRIVATE_KEY, provider);

/**
 * Route handler for NFT upload
 * Handles image upload, IPFS storage, and NFT minting
 * @route POST /upload
 * @param {Object} req.file - Uploaded image file
 * @param {Object} req.body - Contains name, description, and walletAddress address
 * @returns {Object} Transaction hash of the minting operation
 */
router.post('/upload', upload.single('image'), async (req, res) => {
    const { buffer } = req.file;
    const { name, description, walletAddress } = req.body;

    // Validate wallet address before minting (must be a valid Ethereum address)
    if (!ethers.isAddress(walletAddress)) {
        res.status(422).send('Invalid wallet address');
        return;
    }

    // Upload image to IPFS using Pinata
    const { cid: imageCID } = await pinata.upload.public.file(new File([buffer], name)).keyvalues({
        name,
        description,
    });

    // Create metadata object for the NFT
    const metadata = {
        name,
        description,
        image: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${imageCID}`,
    };

    // Upload metadata to IPFS
    const { cid: metadataCID } = await pinata.upload.public.json(metadata);

    // Construct tokenURI
    const tokenURI = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${metadataCID}`;

    //  mint NFT
    const transaction = await nft.connect(signer).createNft(walletAddress, tokenURI);
    const result = await transaction.wait();

    res.status(200).json({
        hash: result?.hash,
    });
});

/**
 * Route handler to list all NFTs
 * Retrieves all NFT token IDs and their URIs
 * @route GET /list
 * @returns {Array} List of NFT token URIs
 */
router.get('/list', auth, async (req, res) => {
    // Get total number of NFTs minted
    let totalSupply = await nft.totalSupply();
    totalSupply = totalSupply.toString();
    
    // create an array to store all tokenURIs 
    const tokenURIs = [];
    // Iterate through all NFTs and fetch their URIs
    for (i = 0; i < totalSupply; i++) {
        let tokenId = await nft.tokenByIndex(i);
        tokenId = tokenId.toString();
        
        const tokenURI = await nft.tokenURI(tokenId);
        // add tokenURIs to the 
        tokenURIs.push(tokenURI);
    }

    // fetch data for all nfts
    const nftList = await Promise.all([
        ...tokenURIs.map(async tokenURI => fetch(tokenURI).then(async res => await res.json()))
    ]);
    
    // return nfts list
    res.status(200).json(nftList);
});

module.exports = router;
