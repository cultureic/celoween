'use client';

import { VotingProvider } from '@/lib/contexts/VotingProvider';
import { SubmissionProvider } from '@/lib/contexts/SubmissionProvider';
import { ContestSubmissions } from './ContestSubmissions';
import SubmissionForm from './SubmissionForm';
import { getVotingContractConfig } from '@/lib/contracts/voting-contract';

interface ContestSubmissionsWrapperProps {
  contestId: string;
  contestStatus: string;
}

export function ContestSubmissionsWrapper({ contestId, contestStatus }: ContestSubmissionsWrapperProps) {
  const { address, abi } = getVotingContractConfig();
  
  // If no contract address is configured, fall back to database-only
  if (!address) {
    console.warn('[CONTEST] Voting contract not configured, using database-only mode');
    return (
      <div>
        <div className="flex justify-center mb-8">
          <SubmissionForm contestId={contestId} useSmartContract={false} />
        </div>
        <ContestSubmissions 
          contestId={contestId} 
          contestStatus={contestStatus}
          useSmartContract={false}
        />
      </div>
    );
  }
  
  return (
    <VotingProvider votingContractAddress={address} votingContractAbi={abi}>
      <SubmissionProvider votingContractAddress={address} votingContractAbi={abi}>
        <div>
          <div className="flex justify-center mb-8">
            <SubmissionForm contestId={contestId} useSmartContract={true} />
          </div>
          <ContestSubmissions 
            contestId={contestId} 
            contestStatus={contestStatus}
            useSmartContract={true}
          />
        </div>
      </SubmissionProvider>
    </VotingProvider>
  );
}
