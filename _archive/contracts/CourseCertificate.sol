// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CourseCertificate
 * @dev Gas-optimized certificate contract for Celo Academy
 * @notice Issues certificates when users complete courses
 * Optimized for gas efficiency on Celo mainnet
 */
contract CourseCertificate {
    
    // ==== STORAGE OPTIMIZATION ====
    
    /// @notice Course completion certificates (user => courseId => timestamp)
    mapping(address => mapping(uint256 => uint256)) private _certificates;
    
    /// @notice Certificate counter for each course
    mapping(uint256 => uint256) public courseCertificateCount;
    
    /// @notice Total certificates issued
    uint256 public totalCertificates;
    
    /// @notice Contract owner
    address public immutable owner;
    
    // ==== EVENTS ====
    
    /// @notice Emitted when a certificate is issued
    /// @param recipient The certificate recipient
    /// @param courseId The course ID
    /// @param timestamp When the certificate was issued
    event CertificateIssued(
        address indexed recipient, 
        uint256 indexed courseId, 
        uint256 timestamp
    );
    
    // ==== ERRORS ====
    
    error Unauthorized();
    error CertificateAlreadyExists();
    error CertificateNotFound();
    error InvalidCourseId();
    error InvalidRecipient();
    
    // ==== CONSTRUCTOR ====
    
    constructor() {
        owner = msg.sender;
    }
    
    // ==== MODIFIERS ====
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }
    
    modifier validCourseId(uint256 courseId) {
        if (courseId == 0) revert InvalidCourseId();
        _;
    }
    
    modifier validRecipient(address recipient) {
        if (recipient == address(0)) revert InvalidRecipient();
        _;
    }
    
    // ==== MAIN FUNCTIONS ====
    
    /**
     * @notice Issue a certificate to a user for completing a course
     * @param recipient The certificate recipient
     * @param courseId The completed course ID
     */
    function issueCertificate(
        address recipient, 
        uint256 courseId
    ) 
        external 
        onlyOwner 
        validRecipient(recipient) 
        validCourseId(courseId) 
    {
        // Check if certificate already exists
        if (_certificates[recipient][courseId] != 0) {
            revert CertificateAlreadyExists();
        }
        
        // Issue certificate with current timestamp
        uint256 timestamp = block.timestamp;
        _certificates[recipient][courseId] = timestamp;
        
        // Update counters using unchecked for gas optimization
        unchecked {
            courseCertificateCount[courseId]++;
            totalCertificates++;
        }
        
        emit CertificateIssued(recipient, courseId, timestamp);
    }
    
    /**
     * @notice Batch issue certificates for multiple recipients
     * @param recipients Array of certificate recipients
     * @param courseId The completed course ID
     */
    function batchIssueCertificates(
        address[] calldata recipients,
        uint256 courseId
    ) 
        external 
        onlyOwner 
        validCourseId(courseId) 
    {
        uint256 length = recipients.length;
        if (length == 0) revert InvalidRecipient();
        
        uint256 timestamp = block.timestamp;
        uint256 newCertificates = 0;
        
        for (uint256 i = 0; i < length;) {
            address recipient = recipients[i];
            
            // Skip if invalid recipient or certificate already exists
            if (recipient != address(0) && _certificates[recipient][courseId] == 0) {
                _certificates[recipient][courseId] = timestamp;
                newCertificates++;
                
                emit CertificateIssued(recipient, courseId, timestamp);
            }
            
            unchecked { i++; }
        }
        
        // Update counters
        if (newCertificates > 0) {
            unchecked {
                courseCertificateCount[courseId] += newCertificates;
                totalCertificates += newCertificates;
            }
        }
    }
    
    // ==== VIEW FUNCTIONS ====
    
    /**
     * @notice Check if a user has a certificate for a course
     * @param recipient The user address
     * @param courseId The course ID
     * @return exists Whether the certificate exists
     * @return timestamp When the certificate was issued (0 if doesn't exist)
     */
    function hasCertificate(
        address recipient, 
        uint256 courseId
    ) 
        external 
        view 
        returns (bool exists, uint256 timestamp) 
    {
        timestamp = _certificates[recipient][courseId];
        exists = timestamp != 0;
    }
    
    /**
     * @notice Get certificate timestamp for a user and course
     * @param recipient The user address
     * @param courseId The course ID
     * @return timestamp When the certificate was issued
     */
    function getCertificateTimestamp(
        address recipient, 
        uint256 courseId
    ) 
        external 
        view 
        returns (uint256 timestamp) 
    {
        timestamp = _certificates[recipient][courseId];
        if (timestamp == 0) revert CertificateNotFound();
    }
    
    /**
     * @notice Get multiple certificate statuses for a user
     * @param recipient The user address
     * @param courseIds Array of course IDs to check
     * @return statuses Array of certificate timestamps (0 if doesn't exist)
     */
    function getCertificateStatuses(
        address recipient,
        uint256[] calldata courseIds
    ) 
        external 
        view 
        returns (uint256[] memory statuses) 
    {
        uint256 length = courseIds.length;
        statuses = new uint256[](length);
        
        for (uint256 i = 0; i < length;) {
            statuses[i] = _certificates[recipient][courseIds[i]];
            unchecked { i++; }
        }
    }
    
    /**
     * @notice Get total number of certificates for a course
     * @param courseId The course ID
     * @return count Number of certificates issued for the course
     */
    function getCourseCertificateCount(uint256 courseId) 
        external 
        view 
        returns (uint256 count) 
    {
        count = courseCertificateCount[courseId];
    }
    
    /**
     * @notice Get contract statistics
     * @return totalIssued Total certificates issued
     * @return contractOwner Contract owner address
     */
    function getStats() 
        external 
        view 
        returns (uint256 totalIssued, address contractOwner) 
    {
        totalIssued = totalCertificates;
        contractOwner = owner;
    }
}