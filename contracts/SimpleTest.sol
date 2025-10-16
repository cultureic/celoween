// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleTest {
    uint256 public number;
    
    constructor() {
        number = 42;
    }
    
    function setNumber(uint256 _number) public {
        number = _number;
    }
}
