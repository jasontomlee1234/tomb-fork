// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

import "./owner/Operator.sol";

contract DummyToken is ERC20Burnable {

    constructor() public ERC20("DUMMYWFTM", "DUMMYWFTM") {
        mint(address(0xCb0ca708257364DFaA9201880AB5F32eCa1eF972), 1000 ether);
        mint(address(0x74490248F226aDbE2c5446A3932bD0D565E2DD2f), 1000 ether);
    }

    function mint(address recipient_, uint256 amount_) public {
        _mint(recipient_, amount_);

    }

    function burn(uint256 amount) public override {
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
    }
}
