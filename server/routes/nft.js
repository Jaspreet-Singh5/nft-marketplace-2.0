const express = require('express');
const multer = require('multer');
const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const NFT = require('../models/NFT');
const pinataSDK = require('@pinata/sdk');

const router = express.Router();

// Configure Pinata SDK with the latest approach
const pinata = new pinataSDK({
    pinataJWTKey: process.env.PINATA_JWT,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
});

// Validate Ethereum address
const isValidEthereumAddress = address => {
    try {
        return ethers.isAddress(address);
    } catch (error) {
        return false;
    }
};

// Upload NFT image to IPFS via Pinata
router.post('/upload', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const filePath = req.file.path;

        // Read file as stream for pinata
        const readableStreamForFile = fs.createReadStream(filePath);

        // Upload to Pinata
        const result = await pinata.pinFileToIPFS(readableStreamForFile, {
            pinataMetadata: {
                name: req.body.name || `NFT-${Date.now()}`,
            },
        });

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            ipfsHash: result.IpfsHash,
        });
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        res.status(500).json({ message: 'Failed to upload to IPFS', error: error.message });
    }
});

// Mint NFT (create metadata and store in DB)
router.post('/mint', auth, async (req, res) => {
    try {
        const { name, description, ipfsHash, ownerAddress } = req.body;

        // Validate input
        if (!name || !ipfsHash || !ownerAddress) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate Ethereum address
        if (!isValidEthereumAddress(ownerAddress)) {
            return res.status(400).json({ message: 'Invalid Ethereum address' });
        }

        // Create metadata JSON
        const metadata = {
            name,
            description,
            image: `ipfs://${ipfsHash}`,
            attributes: req.body.attributes || [],
        };

        // Pin metadata to IPFS
        const metadataResult = await pinata.pinJSONToIPFS(metadata, {
            pinataMetadata: { name: `metadata-${name}` },
        });

        // Save NFT info to database
        const nft = new NFT({
            name,
            description,
            ipfsHash,
            metadataHash: metadataResult.IpfsHash,
            ownerAddress,
            userId: req.user._id,
        });

        await nft.save();

        res.status(201).json({
            success: true,
            nft: {
                id: nft._id,
                name: nft.name,
                description: nft.description,
                ipfsHash: nft.ipfsHash,
                metadataHash: nft.metadataHash,
                ownerAddress: nft.ownerAddress,
                metadata: metadata,
            },
        });
    } catch (error) {
        console.error('Error minting NFT:', error);
        res.status(500).json({ message: 'Failed to mint NFT', error: error.message });
    }
});

// Get all NFTs (for dashboard)
router.get('/list', auth, async (req, res) => {
    try {
        const nfts = await NFT.find().sort({ createdAt: -1 });

        res.json({
            count: nfts.length,
            nfts: nfts.map(nft => ({
                id: nft._id,
                name: nft.name,
                description: nft.description,
                ipfsHash: nft.ipfsHash,
                metadataHash: nft.metadataHash,
                ownerAddress: nft.ownerAddress,
                createdAt: nft.createdAt,
                imageUrl: `https://gateway.pinata.cloud/ipfs/${nft.ipfsHash}`,
                metadataUrl: `https://gateway.pinata.cloud/ipfs/${nft.metadataHash}`,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch NFTs', error: error.message });
    }
});

// Get user's NFTs
router.get('/my-nfts', auth, async (req, res) => {
    try {
        const nfts = await NFT.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.json({
            count: nfts.length,
            nfts: nfts.map(nft => ({
                id: nft._id,
                name: nft.name,
                description: nft.description,
                ipfsHash: nft.ipfsHash,
                metadataHash: nft.metadataHash,
                ownerAddress: nft.ownerAddress,
                createdAt: nft.createdAt,
                imageUrl: `https://gateway.pinata.cloud/ipfs/${nft.ipfsHash}`,
                metadataUrl: `https://gateway.pinata.cloud/ipfs/${nft.metadataHash}`,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch NFTs', error: error.message });
    }
});

// Get NFTs by wallet address
router.get('/by-wallet/:address', auth, async (req, res) => {
    try {
        const { address } = req.params;

        // Validate address
        if (!isValidEthereumAddress(address)) {
            return res.status(400).json({ message: 'Invalid Ethereum address' });
        }

        const nfts = await NFT.find({ ownerAddress: address }).sort({ createdAt: -1 });

        res.json({
            count: nfts.length,
            nfts: nfts.map(nft => ({
                id: nft._id,
                name: nft.name,
                description: nft.description,
                ipfsHash: nft.ipfsHash,
                metadataHash: nft.metadataHash,
                ownerAddress: nft.ownerAddress,
                createdAt: nft.createdAt,
                imageUrl: `https://gateway.pinata.cloud/ipfs/${nft.ipfsHash}`,
                metadataUrl: `https://gateway.pinata.cloud/ipfs/${nft.metadataHash}`,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch NFTs', error: error.message });
    }
});

// Get single NFT details
router.get('/:id', auth, async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ message: 'NFT not found' });
        }

        res.json({
            id: nft._id,
            name: nft.name,
            description: nft.description,
            ipfsHash: nft.ipfsHash,
            metadataHash: nft.metadataHash,
            ownerAddress: nft.ownerAddress,
            createdAt: nft.createdAt,
            imageUrl: `https://gateway.pinata.cloud/ipfs/${nft.ipfsHash}`,
            metadataUrl: `https://gateway.pinata.cloud/ipfs/${nft.metadataHash}`,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch NFT', error: error.message });
    }
});

// Validate wallet address
router.post('/validate-address', auth, (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ message: 'Address is required' });
    }

    const isValid = isValidEthereumAddress(address);

    res.json({
        address,
        isValid,
    });
});

module.exports = router;
