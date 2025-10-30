// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleBadge
 * @dev ERC1155 dynamic badge representing course enrollment and progress
 * Each user gets exactly 1 NFT per course (tokenId)
 * Metadata updates dynamically based on module completion
 * The balance always stays at 1, but metadata reflects progress
 */
contract SimpleBadge is ERC1155, Ownable {
    // Track enrollment
    mapping(address => mapping(uint256 => bool)) public claimed;
    
    // Track which modules have been completed for each course
    // mapping(user => mapping(courseTokenId => mapping(moduleIndex => completed)))
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) public moduleCompleted;
    
    // Track total modules completed per user per course
    mapping(address => mapping(uint256 => uint256)) public modulesCompletedCount;
    
    // Events
    event Enrolled(address indexed user, uint256 indexed courseTokenId);
    event ModuleCompleted(address indexed user, uint256 indexed courseTokenId, uint256 moduleIndex, uint256 totalCompleted);
    
    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {}
    
    /**
     * @dev Claim initial enrollment badge for a course
     * Mints exactly 1 NFT - user will only ever have 1 NFT per course
     */
    function claim(uint256 tokenId) external {
        require(!claimed[msg.sender][tokenId], "Already claimed");
        claimed[msg.sender][tokenId] = true;
        _mint(msg.sender, tokenId, 1, "");
        emit Enrolled(msg.sender, tokenId);
    }
    
    /**
     * @dev Complete a module - updates state, NO minting
     * The NFT metadata will reflect this change dynamically
     * @param courseTokenId The tokenId of the course
     * @param moduleIndex The index of the module being completed (0-based)
     */
    function completeModule(uint256 courseTokenId, uint256 moduleIndex) external {
        require(claimed[msg.sender][courseTokenId], "Must enroll first");
        require(!moduleCompleted[msg.sender][courseTokenId][moduleIndex], "Module already completed");
        
        // Mark module as completed
        moduleCompleted[msg.sender][courseTokenId][moduleIndex] = true;
        
        // Increment the completed count
        modulesCompletedCount[msg.sender][courseTokenId]++;
        
        uint256 totalCompleted = modulesCompletedCount[msg.sender][courseTokenId];
        emit ModuleCompleted(msg.sender, courseTokenId, moduleIndex, totalCompleted);
    }
    
    /**
     * @dev Check if a user has completed a specific module
     */
    function hasCompletedModule(address user, uint256 courseTokenId, uint256 moduleIndex) external view returns (bool) {
        return moduleCompleted[user][courseTokenId][moduleIndex];
    }
    
    /**
     * @dev Get the number of modules completed for a course
     */
    function getModulesCompleted(address user, uint256 courseTokenId) external view returns (uint256) {
        return modulesCompletedCount[user][courseTokenId];
    }
    
    /**
     * @dev Admin function to mint badges directly
     */
    function adminMint(address to, uint256 tokenId, uint256 amount) external onlyOwner {
        _mint(to, tokenId, amount, "");
    }
    
    /**
     * @dev Check if user has the course badge (enrolled)
     */
    function hasBadge(address user, uint256 tokenId) external view returns (bool) {
        return balanceOf(user, tokenId) > 0;
    }
    
    /**
     * @dev Override uri to return dynamic metadata based on user and tokenId
     * This allows the same NFT to show different progress for different users
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        // Return base URI that will be called with tokenId and user address
        // Frontend/API will generate metadata dynamically
        return string(abi.encodePacked(super.uri(tokenId), "/", Strings.toString(tokenId)));
    }
}

// Helper library for converting uint to string
library Strings {
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
