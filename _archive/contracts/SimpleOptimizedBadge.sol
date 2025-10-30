// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleOptimizedBadge
 * @dev Gas-optimized course enrollment and progress tracking
 * Target: <0.05 CELO per transaction
 */
contract SimpleOptimizedBadge {
    
    // Pack enrollment + module completion into single storage slot
    // user => courseId => packed data (1 bit enrolled + up to 255 modules)
    mapping(address => mapping(uint256 => uint256)) private userData;
    
    // Track total modules completed for progress calculation
    mapping(address => mapping(uint256 => uint8)) public totalCompleted;
    
    // Events
    event Enrolled(address indexed user, uint256 indexed courseId);
    event ModuleCompleted(address indexed user, uint256 indexed courseId, uint8 moduleIndex, uint8 total);
    
    /**
     * @dev Enroll in a course (sets bit 0)
     */
    function enroll(uint256 courseId) external {
        uint256 data = userData[msg.sender][courseId];
        require(data & 1 == 0, "Already enrolled");
        
        userData[msg.sender][courseId] = data | 1;
        emit Enrolled(msg.sender, courseId);
    }
    
    /**
     * @dev Complete a module (sets bit 1-255)
     */
    function completeModule(uint256 courseId, uint8 moduleIndex) external {
        require(moduleIndex > 0 && moduleIndex < 255, "Invalid module");
        
        uint256 data = userData[msg.sender][courseId];
        require(data & 1 != 0, "Not enrolled");
        
        uint256 moduleBit = 1 << moduleIndex;
        require(data & moduleBit == 0, "Module completed");
        
        userData[msg.sender][courseId] = data | moduleBit;
        totalCompleted[msg.sender][courseId]++;
        
        emit ModuleCompleted(msg.sender, courseId, moduleIndex, totalCompleted[msg.sender][courseId]);
    }
    
    /**
     * @dev Check if user is enrolled
     */
    function isEnrolled(address user, uint256 courseId) external view returns (bool) {
        return userData[user][courseId] & 1 != 0;
    }
    
    /**
     * @dev Check if module is completed
     */
    function isModuleCompleted(address user, uint256 courseId, uint8 moduleIndex) external view returns (bool) {
        if (moduleIndex == 0 || moduleIndex >= 255) return false;
        return userData[user][courseId] & (1 << moduleIndex) != 0;
    }
    
    /**
     * @dev Get total modules completed
     */
    function getModulesCompleted(address user, uint256 courseId) external view returns (uint8) {
        return totalCompleted[user][courseId];
    }
}