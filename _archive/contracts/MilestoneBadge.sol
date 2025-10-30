// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MilestoneBadge
 * @dev ERC1155 token representing course progress badges
 * Each tokenId represents a course, and the balance represents modules completed
 * Users can incrementally claim progress on the same course tokenId
 */
contract MilestoneBadge is ERC1155, Ownable {
    // Track which modules have been claimed for each user and course
    // mapping(user => mapping(courseTokenId => mapping(moduleIndex => claimed)))
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) public moduleClaimed;
    
    // Events
    event ModuleClaimed(address indexed user, uint256 indexed courseTokenId, uint256 moduleIndex, uint256 newBalance);
    event CourseEnrolled(address indexed user, uint256 indexed courseTokenId);
    
    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {}
    
    /**
     * @dev Claim a module completion for a course
     * @param courseTokenId The tokenId representing the course
     * @param moduleIndex The index of the module being completed (0-based)
     */
    function claimModule(uint256 courseTokenId, uint256 moduleIndex) external {
        require(!moduleClaimed[msg.sender][courseTokenId][moduleIndex], "Module already claimed");
        
        // Mark this specific module as claimed
        moduleClaimed[msg.sender][courseTokenId][moduleIndex] = true;
        
        // Mint +1 to the user's course badge balance
        _mint(msg.sender, courseTokenId, 1, "");
        
        uint256 newBalance = balanceOf(msg.sender, courseTokenId);
        emit ModuleClaimed(msg.sender, courseTokenId, moduleIndex, newBalance);
    }
    
    /**
     * @dev Claim initial enrollment badge for a course
     * @param courseTokenId The tokenId representing the course
     */
    function claimEnrollment(uint256 courseTokenId) external {
        require(balanceOf(msg.sender, courseTokenId) == 0, "Already enrolled");
        
        // Mint initial badge with balance of 0 (or 1 if you want enrollment to count)
        _mint(msg.sender, courseTokenId, 1, "");
        
        emit CourseEnrolled(msg.sender, courseTokenId);
    }
    
    /**
     * @dev Check if a user has claimed a specific module
     */
    function hasClaimedModule(address user, uint256 courseTokenId, uint256 moduleIndex) external view returns (bool) {
        return moduleClaimed[user][courseTokenId][moduleIndex];
    }
    
    /**
     * @dev Get the number of modules completed for a course (equivalent to balance)
     */
    function getModulesCompleted(address user, uint256 courseTokenId) external view returns (uint256) {
        return balanceOf(user, courseTokenId);
    }
    
    /**
     * @dev Admin function to mint badges directly
     */
    function adminMint(address to, uint256 tokenId, uint256 amount) external onlyOwner {
        _mint(to, tokenId, amount, "");
    }
    
    /**
     * @dev Legacy claim function for backward compatibility
     * This mints a single badge (useful for one-time badges)
     */
    function claim(uint256 tokenId) external {
        // For backward compatibility, just mint 1 badge
        // In the new model, this is equivalent to claiming enrollment
        require(balanceOf(msg.sender, tokenId) == 0, "Already claimed");
        _mint(msg.sender, tokenId, 1, "");
    }
}
