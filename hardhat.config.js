require('@nomicfoundation/hardhat-toolbox');
const { vars } = require('hardhat/config');
require('dotenv').config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const privateKeys = process.env.PRIVATE_KEYS || '';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: '0.8.28',
    sourcify: {
        enabled: true,
    },
    networks: {
        localhost: {},
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: privateKeys.split(','),
        },
    },
    etherscan: {
        apiKey: {
            sepolia: ETHERSCAN_API_KEY,
        },
    },
};
