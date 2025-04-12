const express = require('express');
const multer = require('multer');
const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');
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

// Upload NFT image to IPFS via Pinata
router.post('/upload', upload.single('image'), async (req, res) => {
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


module.exports = router;
