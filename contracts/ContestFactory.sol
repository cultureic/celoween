// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ContestFactory
 * @dev Creates and manages Halloween contest competitions on Celo
 */
contract ContestFactory is Ownable, ReentrancyGuard {
    
    struct Contest {
        uint256 id;
        address creator;
        string title;
        string metadataURI;      // IPFS hash for full contest details
        uint256 prizePool;
        address prizeToken;      // cUSD, CELO, or custom token
        uint256 startTime;
        uint256 endTime;
        uint256 votingEndTime;
        ContestStatus status;
        uint256 submissionCount;
        uint256 totalVotes;
    }
    
    enum ContestStatus {
        Draft,
        Active,
        Voting,
        Ended,
        Cancelled
    }
    
    // State variables
    uint256 private _contestIdCounter;
    mapping(uint256 => Contest) public contests;
    mapping(address => uint256[]) public creatorContests;
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeBps = 250;
    address public feeCollector;
    
    // Events
    event ContestCreated(
        uint256 indexed contestId,
        address indexed creator,
        string title,
        uint256 prizePool,
        uint256 startTime,
        uint256 endTime
    );
    
    event ContestStatusChanged(
        uint256 indexed contestId,
        ContestStatus oldStatus,
        ContestStatus newStatus
    );
    
    event PrizePoolIncreased(
        uint256 indexed contestId,
        address indexed contributor,
        uint256 amount,
        uint256 newTotal
    );
    
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    
    constructor(address _feeCollector) Ownable(msg.sender) {
        feeCollector = _feeCollector;
    }
    
    /**
     * @dev Create a new contest
     */
    function createContest(
        string memory _title,
        string memory _metadataURI,
        uint256 _prizePool,
        address _prizeToken,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _votingEndTime
    ) external payable nonReentrant returns (uint256) {
        require(_startTime > block.timestamp, "Start time must be in future");
        require(_endTime > _startTime, "End time must be after start");
        require(_votingEndTime > _endTime, "Voting end must be after contest end");
        require(_prizePool > 0, "Prize pool must be greater than 0");
        
        // If prize token is address(0), it means native CELO
        if (_prizeToken == address(0)) {
            require(msg.value >= _prizePool, "Insufficient CELO for prize pool");
        }
        
        uint256 contestId = _contestIdCounter++;
        
        contests[contestId] = Contest({
            id: contestId,
            creator: msg.sender,
            title: _title,
            metadataURI: _metadataURI,
            prizePool: _prizePool,
            prizeToken: _prizeToken,
            startTime: _startTime,
            endTime: _endTime,
            votingEndTime: _votingEndTime,
            status: ContestStatus.Draft,
            submissionCount: 0,
            totalVotes: 0
        });
        
        creatorContests[msg.sender].push(contestId);
        
        emit ContestCreated(
            contestId,
            msg.sender,
            _title,
            _prizePool,
            _startTime,
            _endTime
        );
        
        return contestId;
    }
    
    /**
     * @dev Update contest status
     */
    function updateContestStatus(
        uint256 _contestId,
        ContestStatus _newStatus
    ) external {
        Contest storage contest = contests[_contestId];
        require(contest.creator == msg.sender || msg.sender == owner(), "Not authorized");
        
        ContestStatus oldStatus = contest.status;
        contest.status = _newStatus;
        
        emit ContestStatusChanged(_contestId, oldStatus, _newStatus);
    }
    
    /**
     * @dev Increase prize pool
     */
    function increasePrizePool(uint256 _contestId) external payable nonReentrant {
        require(msg.value > 0, "Must send CELO");
        Contest storage contest = contests[_contestId];
        require(contest.prizeToken == address(0), "Contest uses token, not CELO");
        require(contest.status != ContestStatus.Ended, "Contest ended");
        require(contest.status != ContestStatus.Cancelled, "Contest cancelled");
        
        contest.prizePool += msg.value;
        
        emit PrizePoolIncreased(_contestId, msg.sender, msg.value, contest.prizePool);
    }
    
    /**
     * @dev Update submission count (called by VotingContract)
     */
    function incrementSubmissionCount(uint256 _contestId) external {
        // In production, add access control for VotingContract
        contests[_contestId].submissionCount++;
    }
    
    /**
     * @dev Update vote count (called by VotingContract)
     */
    function incrementVoteCount(uint256 _contestId) external {
        // In production, add access control for VotingContract
        contests[_contestId].totalVotes++;
    }
    
    /**
     * @dev Get contest details
     */
    function getContest(uint256 _contestId) external view returns (Contest memory) {
        return contests[_contestId];
    }
    
    /**
     * @dev Get contests created by an address
     */
    function getCreatorContests(address _creator) external view returns (uint256[] memory) {
        return creatorContests[_creator];
    }
    
    /**
     * @dev Get total contest count
     */
    function getTotalContests() external view returns (uint256) {
        return _contestIdCounter;
    }
    
    /**
     * @dev Check if contest is active
     */
    function isContestActive(uint256 _contestId) public view returns (bool) {
        Contest memory contest = contests[_contestId];
        return contest.status == ContestStatus.Active &&
               block.timestamp >= contest.startTime &&
               block.timestamp <= contest.endTime;
    }
    
    /**
     * @dev Check if voting is active
     */
    function isVotingActive(uint256 _contestId) public view returns (bool) {
        Contest memory contest = contests[_contestId];
        return contest.status == ContestStatus.Voting &&
               block.timestamp > contest.endTime &&
               block.timestamp <= contest.votingEndTime;
    }
    
    /**
     * @dev Update platform fee (owner only)
     */
    function updatePlatformFee(uint256 _newFeeBps) external onlyOwner {
        require(_newFeeBps <= 1000, "Fee too high (max 10%)");
        uint256 oldFee = platformFeeBps;
        platformFeeBps = _newFeeBps;
        emit PlatformFeeUpdated(oldFee, _newFeeBps);
    }
    
    /**
     * @dev Update fee collector (owner only)
     */
    function updateFeeCollector(address _newCollector) external onlyOwner {
        require(_newCollector != address(0), "Invalid address");
        feeCollector = _newCollector;
    }
    
    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(feeCollector).transfer(balance);
    }
    
    receive() external payable {}
}
