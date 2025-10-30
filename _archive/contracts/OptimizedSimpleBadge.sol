// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OptimizedSimpleBadge
 * @dev Ultra gas-efficient course enrollment and progress tracking
 * Uses bit packing and minimal storage for maximum efficiency
 * Target: <0.1 CELO per transaction
 */
contract OptimizedSimpleBadge {
    
    // ==== STORAGE OPTIMIZATION ====
    
    // Pack enrollment + module completion into single storage slot
    // user => courseId => packed data (1 bit enrolled + 255 bits for modules)
    mapping(address => mapping(uint256 => uint256)) private userData;
    
    // Only track total completed count (not individual module mapping)
    // user => courseId => count (saves significant gas)
    mapping(address => mapping(uint256 => uint8)) public totalModulesCompleted;
    
    // ==== EVENTS (Minimal) ====
    event Enrolled(address indexed user, uint256 indexed courseId);
    event ModuleCompleted(address indexed user, uint256 indexed courseId, uint8 moduleIndex, uint8 total);
    
    // ==== ERRORS (Gas efficient) ====
    error AlreadyEnrolled();
    error NotEnrolled();
    error ModuleAlreadyCompleted();
    error InvalidModule();
    
    // ==== OPTIMIZED FUNCTIONS ====
    
    /**
     * @dev Ultra-efficient enrollment (single SSTORE)
     */
    function enroll(uint256 courseId) external {
        uint256 data = userData[msg.sender][courseId];
        
        // Check if already enrolled (bit 0)
        if (data & 1 != 0) revert AlreadyEnrolled();
        
        // Set enrolled bit (bit 0 = 1)
        userData[msg.sender][courseId] = data | 1;
        
        emit Enrolled(msg.sender, courseId);
    }
    
    /**
     * @dev Ultra-efficient module completion
     * @param courseId Course identifier  
     * @param moduleIndex Module index (0-254, max 255 modules per course)
     */
    function completeModule(uint256 courseId, uint8 moduleIndex) external {
        uint256 data = userData[msg.sender][courseId];
        
        // Must be enrolled first
        if (data & 1 == 0) revert NotEnrolled();
        
        // Check valid module index (0-254, bit 0 is reserved for enrollment)
        if (moduleIndex == 0 || moduleIndex > 254) revert InvalidModule();
        
        uint256 moduleBit = 1 << moduleIndex;
        
        // Check if module already completed
        if (data & moduleBit != 0) revert ModuleAlreadyCompleted();
        
        // Set module completed bit
        userData[msg.sender][courseId] = data | moduleBit;
        
        // Increment total (separate mapping for efficiency)
        uint8 newTotal = ++totalModulesCompleted[msg.sender][courseId];
        
        emit ModuleCompleted(msg.sender, courseId, moduleIndex, newTotal);
    }
    
    /**
     * @dev Batch complete multiple modules (ultra gas efficient)
     * @param courseId Course identifier
     * @param moduleIndices Array of module indices to complete
     */
    function completeModulesBatch(uint256 courseId, uint8[] calldata moduleIndices) external {
        uint256 data = userData[msg.sender][courseId];
        
        // Must be enrolled first
        if (data & 1 == 0) revert NotEnrolled();
        
        uint256 newModuleBits = 0;
        uint8 completedCount = 0;
        
        // Process all modules in a single loop
        for (uint256 i = 0; i < moduleIndices.length;) {
            uint8 moduleIndex = moduleIndices[i];
            
            if (moduleIndex == 0 || moduleIndex > 254) revert InvalidModule();
            
            uint256 moduleBit = 1 << moduleIndex;
            
            // Only process if not already completed
            if (data & moduleBit == 0) {
                newModuleBits |= moduleBit;
                completedCount++;
            }
            
            unchecked { ++i; }
        }
        
        // Single storage write
        userData[msg.sender][courseId] = data | newModuleBits;
        totalModulesCompleted[msg.sender][courseId] += completedCount;
    }
    
    // ==== VIEW FUNCTIONS ====
    
    /**
     * @dev Check if user is enrolled in course
     */
    function isEnrolled(address user, uint256 courseId) external view returns (bool) {
        return userData[user][courseId] & 1 != 0;
    }
    
    /**
     * @dev Check if user completed specific module
     */
    function isModuleCompleted(address user, uint256 courseId, uint8 moduleIndex) external view returns (bool) {
        if (moduleIndex == 0 || moduleIndex > 254) return false;
        uint256 data = userData[user][courseId];
        return data & (1 << moduleIndex) != 0;
    }
    
    /**
     * @dev Get total modules completed count
     */
    function getModulesCompleted(address user, uint256 courseId) external view returns (uint8) {
        return totalModulesCompleted[user][courseId];
    }
    
    /**
     * @dev Get completion progress as percentage (0-100)
     */
    function getProgressPercentage(address user, uint256 courseId, uint8 totalModules) external view returns (uint8) {
        if (totalModules == 0) return 0;
        uint8 completed = totalModulesCompleted[user][courseId];
        return (completed * 100) / totalModules;
    }
    
    /**
     * @dev Get all completion data for a user+course (gas efficient)
     */
    function getUserCourseData(address user, uint256 courseId) external view returns (
        bool enrolled,
        uint8 modulesCompleted,
        uint256 completionBitmap
    ) {
        uint256 data = userData[user][courseId];
        enrolled = data & 1 != 0;
        modulesCompleted = totalModulesCompleted[user][courseId];
        completionBitmap = data >> 1; // Remove enrollment bit
    }
}