// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VanERC721 is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    constructor(
        address initialOwner
    ) ERC721("VanToken", "VAN") Ownable(initialOwner) {}

    /**
     * @notice  Add token to caller's balance
     */
    function buy() public payable {
        _nextTokenId++;

        _safeMint(msg.sender, _nextTokenId);
    }

    /**
     * @notice  Mints tokens
     * Can be called only by owner
     * @param to - address where to mint tokens
     * @param tokenId - uint256 token id
     */
    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, "https://vanchenkin.ru/1.json");
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
