require("@nomicfoundation/hardhat-toolbox");
const { vars } = require('hardhat/config');

const ETHERSCAN_API_KEY = vars.get('ETHERSCAN_API_KEY');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: true,
  },
};
