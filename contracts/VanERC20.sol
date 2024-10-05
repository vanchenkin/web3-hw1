// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

contract VanERC20 is ERC20, ERC20Permit, Ownable {
    uint256 public transferTaxRate = 5; // Tax for transfer - 5%

    constructor(
        address initialOwner
    ) ERC20("VanToken", "VAN") ERC20Permit("VanToken") Ownable(initialOwner) {}

    /**
     * @notice  Add tokens to caller's balance by the amount passed in msg.value
     */
    function buy() public payable {
        uint256 tokensToBuy = msg.value;

        _mint(msg.sender, tokensToBuy);
    }

    /**
     * @notice  Mints tokens
     * Can be called only by owner
     * @param to - address where to mint tokens
     * @param amount - uint256 of tokens
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * Transfer with tax
     * @inheritdoc ERC20
     */
    function transfer(
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        address owner = _msgSender();

        uint256 taxAmount = (value * transferTaxRate) / 100;
        uint256 actualAmount = value - taxAmount;

        _transfer(owner, to, actualAmount);

        if (to != address(this)) {
            _burn(owner, taxAmount);
        }
        return true;
    }

    /**
     * TransferFrom with tax
     * @inheritdoc ERC20
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);

        uint256 taxAmount = (value * transferTaxRate) / 100;
        uint256 actualAmount = value - taxAmount;

        _transfer(from, to, actualAmount);

        if (to != address(this)) {
            _burn(from, taxAmount);
        }

        return true;
    }
}
