// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721URIStorage, ERC721 } from '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

/// @title NFT Contract
/// @notice A simple NFT contract that allows minting of tokens with metadata
/// @dev Extends OpenZeppelin's ERC721URIStorage for URI storage functionality
contract NFT is ERC721URIStorage {
    // Counter for token IDs, automatically initialized to 0
    uint256 private _nextTokenId;

    /// @notice Initialize the NFT contract
    /// @dev Sets the name "NFT" and symbol "NFT" for the collection
    constructor() ERC721('NFT', 'NFT') {}

    /// @notice Mint a new NFT to a specified address with metadata
    /// @dev Mints token and sets its URI in one transaction
    /// @param user The address that will receive the minted NFT
    /// @param tokenURI The metadata URI for the NFT
    /// @return uint256 The ID of the newly minted token
    function awardItem(address user, string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _nextTokenId++; // Get current token ID and increment
        _mint(user, tokenId); // Mint the NFT to the user
        _setTokenURI(tokenId, tokenURI); // Set the token's metadata URI

        return tokenId;
    }
}
