const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    ipfsHash: {
        type: String,
        required: true,
    },
    metadataHash: {
        type: String,
        required: true,
    },
    ownerAddress: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // New blockchain related fields
    tokenId: {
        type: Number,
    },
    transactionHash: {
        type: String,
    },
    blockNumber: {
        type: Number,
    },
    network: {
        type: String,
        default: 'ethereum',
    },
    contractAddress: {
        type: String,
    },
    mintedAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'minted', 'failed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const NFT = mongoose.model('NFT', nftSchema);

module.exports = NFT;
