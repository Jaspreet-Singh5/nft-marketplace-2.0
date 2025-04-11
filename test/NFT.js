const chai = require('chai');
const { expect } = chai;
const { ethers } = require('hardhat');

describe('Award an Item', () => {
    let nft,
        user1,
        user2,
        deployer,
        tokenURI = 'https://example.com',
        tx,
        result;

    beforeEach(async () => {
        // get the contract factory
        const NFT = await ethers.getContractFactory('NFT');
        // deploy the contract
        nft = await NFT.deploy();

        // get the signers
        [deployer, user1, user2] = await ethers.getSigners();
    });

    it('should award an item to a user', async () => {
        // award an item to the user
        tx = await nft.awardItem(user1.address, tokenURI);
        await tx.wait();

        // check if the user has 1 minted item
        expect(await nft.balanceOf(user1.address)).to.equal(1);
        // set tokenURI for the item
        expect(await nft.connect(user1).tokenURI(0)).to.equal(tokenURI);
    });

    it('should emit an event when an item is awarded', async () => {
        // emit an event when an item is awarded
        await expect(nft.awardItem(user1.address, tokenURI)).to.emit(nft, 'Transfer').withArgs(ethers.ZeroAddress, user1.address, 0);
    });
});
