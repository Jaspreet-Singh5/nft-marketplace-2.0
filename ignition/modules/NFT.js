const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('NFT', m => {
    const nft = m.contract('NFT', [], {
    });

    return { nft };
});
