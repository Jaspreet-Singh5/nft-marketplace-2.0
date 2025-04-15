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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const NFT = mongoose.model('NFT', nftSchema);

module.exports = NFT;
