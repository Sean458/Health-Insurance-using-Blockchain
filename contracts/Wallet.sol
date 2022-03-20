//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract Wallet{

    receive() external payable{}

    function transact(address receiver, uint256 amount) external payable {
        address payable r = payable(receiver);
        bool sent = r.send(amount*1000000000000000000);
        require(sent,"Transaction Failed: Amount was not sent");
    }

    function checkBalance() external view returns(uint256) {
        return address(this).balance;
    }
}