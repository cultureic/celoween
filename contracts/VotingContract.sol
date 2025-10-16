// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IContestFactory {
    function isVotingActive(uint256 _contestId) external view returns (bool);
    function incrementVoteCount(uint256 _contestId) external;
    function incrementSubmissionCount(uint256 _contestId) external;
}

/**
 * @title VotingContract
 * @dev Handles submissions and gasless voting for contests
 */
contract VotingContract is Ownable, ReentrancyGuard {
    
    struct Submission {
        uint256 id;
        uint256 contestId;
        address submitter;
        string metadataURI;      // IPFS hash for submission content
        uint256 voteCount;
        uint256 timestamp;
        bool exists;
    }
    
    // State variables
    IContestFactory public contestFactory;
    uint256 private _submissionIdCounter;
    
    // Mappings
    mapping(uint256 => Submission) public submissions;
    mapping(uint256 => uint256[]) public contestSubmissions; // contestId => submissionIds
    mapping(uint256 => mapping(address => uint256)) public userSubmission; // contestId => user => submissionId
    mapping(uint256 => mapping(address => bool)) public hasVoted; // submissionId => voter => bool
    mapping(uint256 => address[]) public submissionVoters; // submissionId => voters
    
    // Events
    event SubmissionCreated(
        uint256 indexed submissionId,
        uint256 indexed contestId,
        address indexed submitter,
        string metadataURI
    );
    
    event VoteCast(
        uint256 indexed submissionId,
        uint256 indexed contestId,
        address indexed voter
    );
    
    event VoteRemoved(
        uint256 indexed submissionId,
        uint256 indexed contestId,
        address indexed voter
    );
    
    constructor(address _contestFactory) Ownable(msg.sender) {
        contestFactory = IContestFactory(_contestFactory);
    }
    
    /**
     * @dev Submit an entry to a contest
     */
    function submitEntry(
        uint256 _contestId,
        string memory _metadataURI
    ) external nonReentrant returns (uint256) {
        // Check if user already submitted to this contest
        require(userSubmission[_contestId][msg.sender] == 0, "Already submitted to this contest");
        
        uint256 submissionId = _submissionIdCounter++;
        
        submissions[submissionId] = Submission({
            id: submissionId,
            contestId: _contestId,
            submitter: msg.sender,
            metadataURI: _metadataURI,
            voteCount: 0,
            timestamp: block.timestamp,
            exists: true
        });
        
        contestSubmissions[_contestId].push(submissionId);
        userSubmission[_contestId][msg.sender] = submissionId;
        
        // Notify ContestFactory
        contestFactory.incrementSubmissionCount(_contestId);
        
        emit SubmissionCreated(submissionId, _contestId, msg.sender, _metadataURI);
        
        return submissionId;
    }
    
    /**
     * @dev Cast a vote for a submission (gasless via Biconomy)
     */
    function vote(uint256 _submissionId) external nonReentrant {
        Submission storage submission = submissions[_submissionId];
        require(submission.exists, "Submission does not exist");
        
        uint256 contestId = submission.contestId;
        
        // Check voting is active
        require(contestFactory.isVotingActive(contestId), "Voting not active");
        
        // Check user hasn't voted for this submission
        require(!hasVoted[_submissionId][msg.sender], "Already voted");
        
        // Check user isn't voting for their own submission
        require(submission.submitter != msg.sender, "Cannot vote for own submission");
        
        // Cast vote
        hasVoted[_submissionId][msg.sender] = true;
        submission.voteCount++;
        submissionVoters[_submissionId].push(msg.sender);
        
        // Notify ContestFactory
        contestFactory.incrementVoteCount(contestId);
        
        emit VoteCast(_submissionId, contestId, msg.sender);
    }
    
    /**
     * @dev Remove a vote (allow users to change their vote)
     */
    function removeVote(uint256 _submissionId) external nonReentrant {
        Submission storage submission = submissions[_submissionId];
        require(submission.exists, "Submission does not exist");
        require(hasVoted[_submissionId][msg.sender], "Haven't voted yet");
        
        uint256 contestId = submission.contestId;
        require(contestFactory.isVotingActive(contestId), "Voting not active");
        
        // Remove vote
        hasVoted[_submissionId][msg.sender] = false;
        submission.voteCount--;
        
        // Remove from voters array (gas intensive, but keeps data clean)
        address[] storage voters = submissionVoters[_submissionId];
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == msg.sender) {
                voters[i] = voters[voters.length - 1];
                voters.pop();
                break;
            }
        }
        
        emit VoteRemoved(_submissionId, contestId, msg.sender);
    }
    
    /**
     * @dev Get submission details
     */
    function getSubmission(uint256 _submissionId) external view returns (Submission memory) {
        return submissions[_submissionId];
    }
    
    /**
     * @dev Get all submissions for a contest
     */
    function getContestSubmissions(uint256 _contestId) external view returns (uint256[] memory) {
        return contestSubmissions[_contestId];
    }
    
    /**
     * @dev Get submission with vote details
     */
    function getSubmissionWithVotes(uint256 _submissionId) 
        external 
        view 
        returns (
            Submission memory submission,
            address[] memory voters
        ) 
    {
        return (submissions[_submissionId], submissionVoters[_submissionId]);
    }
    
    /**
     * @dev Get top submissions for a contest (sorted by votes)
     */
    function getTopSubmissions(uint256 _contestId, uint256 _limit) 
        external 
        view 
        returns (Submission[] memory) 
    {
        uint256[] memory submissionIds = contestSubmissions[_contestId];
        uint256 length = submissionIds.length;
        
        if (length == 0) {
            return new Submission[](0);
        }
        
        // Create array of submissions
        Submission[] memory allSubmissions = new Submission[](length);
        for (uint256 i = 0; i < length; i++) {
            allSubmissions[i] = submissions[submissionIds[i]];
        }
        
        // Simple bubble sort (works for small arrays)
        for (uint256 i = 0; i < length; i++) {
            for (uint256 j = i + 1; j < length; j++) {
                if (allSubmissions[j].voteCount > allSubmissions[i].voteCount) {
                    Submission memory temp = allSubmissions[i];
                    allSubmissions[i] = allSubmissions[j];
                    allSubmissions[j] = temp;
                }
            }
        }
        
        // Return top N submissions
        uint256 resultLength = _limit < length ? _limit : length;
        Submission[] memory topSubmissions = new Submission[](resultLength);
        for (uint256 i = 0; i < resultLength; i++) {
            topSubmissions[i] = allSubmissions[i];
        }
        
        return topSubmissions;
    }
    
    /**
     * @dev Check if user has voted for a submission
     */
    function hasUserVoted(uint256 _submissionId, address _user) external view returns (bool) {
        return hasVoted[_submissionId][_user];
    }
    
    /**
     * @dev Get user's submission for a contest
     */
    function getUserSubmission(uint256 _contestId, address _user) external view returns (uint256) {
        return userSubmission[_contestId][_user];
    }
    
    /**
     * @dev Get total submissions count
     */
    function getTotalSubmissions() external view returns (uint256) {
        return _submissionIdCounter;
    }
    
    /**
     * @dev Update ContestFactory address (owner only)
     */
    function updateContestFactory(address _newFactory) external onlyOwner {
        require(_newFactory != address(0), "Invalid address");
        contestFactory = IContestFactory(_newFactory);
    }
}
