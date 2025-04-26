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

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGatewayKey: process.env.PINATA_GATEWAY_URL,
});

const router = express.Router();

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const nft = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
// signer for transactions
const signer = new ethers.Wallet(process.env.MINTER_PRIVATE_KEY, provider);

router.post('/upload', upload.single('image'), async (req, res) => {
    const { buffer } = req.file;

    const { name, description, user } = req.body;

    // upload image to ipfs
    const { cid: imageCID } = await pinata.upload.public.file(new File([buffer], name)).keyvalues({
        name,
        description,
    });

    const metadata = {
        name,
        description,
        image: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${imageCID}`,
    };
    
    // upload metadata to ipfs
    const { cid: metadataCID } = await pinata.upload.public.json(metadata);

    const tokenURI = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${metadataCID}`;
    const transaction = await nft.connect(signer).createNft(user, tokenURI);
    const result = await transaction.wait();
    
    res.status(200).json({
        hash: result?.hash
    });
});

module.exports = router;
