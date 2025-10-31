// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleVoting
 * @dev Simple voting contract - no contest factory bullshit
 */
contract SimpleVoting is Ownable, ReentrancyGuard {
    
    struct Submission {
        uint256 id;
        uint256 contestId;
        address submitter;
        string metadataURI;
        uint256 voteCount;
        uint256 timestamp;
        bool exists;
    }
    
    // State variables
    uint256 private _submissionIdCounter = 1; // Start at 1 to avoid 0 (which means no submission)
    
    // Mappings
    mapping(uint256 => Submission) public submissions;
    mapping(uint256 => uint256[]) public contestSubmissions; // contestId => submissionIds
    mapping(uint256 => mapping(address => uint256)) public userSubmission; // contestId => user => submissionId
    mapping(uint256 => mapping(address => bool)) public hasVoted; // submissionId => voter => bool
    mapping(uint256 => address[]) public submissionVoters; // submissionId => voters
    mapping(uint256 => mapping(address => uint256)) public userVote; // contestId => user => submissionId voted for
    
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
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Submit an entry to a contest
     */
    function submitEntry(
        uint256 _contestId,
        string memory _metadataURI
    ) external nonReentrant returns (uint256) {
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
        
        emit SubmissionCreated(submissionId, _contestId, msg.sender, _metadataURI);
        
        return submissionId;
    }
    
    /**
     * @dev Cast a vote for a submission
     */
    function vote(uint256 _submissionId) external nonReentrant {
        Submission storage submission = submissions[_submissionId];
        require(submission.exists, "Submission does not exist");
        require(submission.submitter != msg.sender, "Cannot vote for own submission");
        
        uint256 contestId = submission.contestId;
        uint256 existingVote = userVote[contestId][msg.sender];
        
        // If user already voted in this contest, remove old vote first
        if (existingVote != 0 && hasVoted[existingVote][msg.sender]) {
            Submission storage oldSubmission = submissions[existingVote];
            hasVoted[existingVote][msg.sender] = false;
            oldSubmission.voteCount--;
            
            // Remove from voters array
            address[] storage oldVoters = submissionVoters[existingVote];
            for (uint256 i = 0; i < oldVoters.length; i++) {
                if (oldVoters[i] == msg.sender) {
                    oldVoters[i] = oldVoters[oldVoters.length - 1];
                    oldVoters.pop();
                    break;
                }
            }
            
            emit VoteRemoved(existingVote, contestId, msg.sender);
        }
        
        // Cast new vote
        hasVoted[_submissionId][msg.sender] = true;
        submission.voteCount++;
        submissionVoters[_submissionId].push(msg.sender);
        userVote[contestId][msg.sender] = _submissionId;
        
        emit VoteCast(_submissionId, contestId, msg.sender);
    }
    
    /**
     * @dev Remove a vote
     */
    function removeVote(uint256 _submissionId) external nonReentrant {
        Submission storage submission = submissions[_submissionId];
        require(submission.exists, "Submission does not exist");
        require(hasVoted[_submissionId][msg.sender], "Haven't voted yet");
        
        uint256 contestId = submission.contestId;
        
        hasVoted[_submissionId][msg.sender] = false;
        submission.voteCount--;
        userVote[contestId][msg.sender] = 0;
        
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
     * @dev Check if user has voted for a submission
     */
    function hasUserVoted(uint256 _submissionId, address _user) external view returns (bool) {
        return hasVoted[_submissionId][_user];
    }
    
    /**
     * @dev Get which submission a user voted for in a contest (0 if no vote)
     */
    function getUserVoteInContest(uint256 _contestId, address _user) external view returns (uint256) {
        return userVote[_contestId][_user];
    }
}
