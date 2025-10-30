'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

// Contract ABIs (simplified for key functions)
const CONTEST_FACTORY_ABI = [
  'function createContest(string memory _title, string memory _metadataURI, uint256 _prizePool, address _prizeToken, uint256 _startTime, uint256 _endTime, uint256 _votingEndTime) external payable returns (uint256)',
  'function getContest(uint256 _contestId) external view returns (tuple(uint256 id, address creator, string title, string metadataURI, uint256 prizePool, address prizeToken, uint256 startTime, uint256 endTime, uint256 votingEndTime, uint8 status, uint256 submissionCount, uint256 totalVotes))',
  'function getTotalContests() external view returns (uint256)',
  'function updateContestStatus(uint256 _contestId, uint8 _newStatus) external',
];

const VOTING_CONTRACT_ABI = [
  'function submitEntry(uint256 _contestId, string memory _metadataURI) external returns (uint256)',
  'function vote(uint256 _submissionId) external',
  'function removeVote(uint256 _submissionId) external',
  'function getContestSubmissions(uint256 _contestId) external view returns (uint256[] memory)',
  'function getSubmission(uint256 _submissionId) external view returns (tuple(uint256 id, uint256 contestId, address submitter, string metadataURI, uint256 voteCount, uint256 timestamp, bool exists))',
  'function hasUserVoted(uint256 _submissionId, address _user) external view returns (bool)',
];

export function useContestContract() {
  const { user, authenticated } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return new ethers.BrowserProvider((window as any).ethereum);
    }
    throw new Error('No Ethereum provider found');
  };

  const getContestFactoryContract = async () => {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const address = process.env.NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS;
    if (!address) throw new Error('Contest Factory address not configured');
    return new ethers.Contract(address, CONTEST_FACTORY_ABI, signer);
  };

  const getVotingContract = async () => {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const address = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS;
    if (!address) throw new Error('Voting Contract address not configured');
    return new ethers.Contract(address, VOTING_CONTRACT_ABI, signer);
  };

  const createContest = async (params: {
    title: string;
    metadataURI: string;
    prizePool: string;
    prizeToken: string;
    startTime: number;
    endTime: number;
    votingEndTime: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const contract = await getContestFactoryContract();
      const tx = await contract.createContest(
        params.title,
        params.metadataURI,
        ethers.parseUnits(params.prizePool, 18),
        params.prizeToken,
        params.startTime,
        params.endTime,
        params.votingEndTime,
        { value: ethers.parseUnits(params.prizePool, 18) }
      );
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitEntry = async (contestId: string, metadataURI: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const contract = await getVotingContract();
      const tx = await contract.submitEntry(contestId, metadataURI);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const castVote = async (submissionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const contract = await getVotingContract();
      const tx = await contract.vote(submissionId);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeVote = async (submissionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const contract = await getVotingContract();
      const tx = await contract.removeVote(submissionId);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getContestFromChain = async (contestId: string) => {
    try {
      const contract = await getContestFactoryContract();
      const contest = await contract.getContest(contestId);
      return contest;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getSubmissionFromChain = async (submissionId: string) => {
    try {
      const contract = await getVotingContract();
      const submission = await contract.getSubmission(submissionId);
      return submission;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const hasVoted = async (submissionId: string, userAddress: string) => {
    try {
      const contract = await getVotingContract();
      return await contract.hasUserVoted(submissionId, userAddress);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    isLoading,
    error,
    createContest,
    submitEntry,
    castVote,
    removeVote,
    getContestFromChain,
    getSubmissionFromChain,
    hasVoted,
  };
}
