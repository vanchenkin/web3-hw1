// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VanERC1155 is ERC1155, Ownable {
    uint256 public constant MAIN_TOKEN_ID = 0;

    constructor(
        address initialOwner
    ) ERC1155("https://vanchenkin.ru/1.json") Ownable(initialOwner) {}

    /**
     * @notice  Add tokens to caller's balance by the amount passed in msg.value
     */
    function buy() public payable {
        uint256 tokensToBuy = msg.value;

        _mint(msg.sender, MAIN_TOKEN_ID, tokensToBuy, "");
    }

    /**
     * @notice  Mints tokens
     * Can be called only by owner
     * @param account - address where to mint tokens
     * @param id - uint256 token id
     * @param amount - uint256 of tokens
     * @param data - data of token
     */
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }
}
