'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { SubmissionCard } from './SubmissionCard';
import { useVoting } from '@/lib/contexts/VotingProvider';

interface Submission {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  voteCount: number;
  onChainId: string | null;
  submitter: {
    walletAddress: string;
  };
}

interface ContestSubmissionsProps {
  contestId: string;
  contestStatus: string;
  useSmartContract: boolean;
}

export function ContestSubmissions({ contestId, contestStatus, useSmartContract }: ContestSubmissionsProps) {
  const { user, login } = usePrivy();
  const voting = useVoting();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [userVotedSubmissionId, setUserVotedSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch(`/api/submissions?contestId=${contestId}`);
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  const fetchUserVotes = useCallback(async () => {
    if (!user?.wallet?.address) return;
    
    try {
      const res = await fetch(`/api/votes?walletAddress=${user.wallet.address}`);
      const data: { votes?: { submissionId: string }[] } = await res.json();
      const votedSubmissionIds = new Set(
        data.votes?.map((vote: { submissionId: string }) => vote.submissionId) || []
      );
      setUserVotes(votedSubmissionIds);
    } catch (error) {
      console.error('Failed to fetch user votes:', error);
    }
  }, [user?.wallet?.address]);
  
  const fetchOnChainVote = useCallback(async () => {
    if (!voting || !useSmartContract) return;
    
    // Use smart account address if available, otherwise EOA
    const address = voting.smartAccountAddress || user?.wallet?.address;
    if (!address) return;
    
    try {
      console.log('[CONTEST SUBMISSIONS] Fetching on-chain vote for address:', address);
      const onChainVotedSubmissionId = await voting.getUserVoteInContest(contestId, address);
      console.log('[CONTEST SUBMISSIONS] On-chain voted submission ID:', onChainVotedSubmissionId);
      
      if (onChainVotedSubmissionId) {
        console.log('[CONTEST SUBMISSIONS] Looking for submission with onChainId:', onChainVotedSubmissionId);
        console.log('[CONTEST SUBMISSIONS] Available submissions:', submissions.map(s => ({ id: s.id, onChainId: s.onChainId })));
        
        // Find the database submission ID from the on-chain ID
        const votedSubmission = submissions.find(s => s.onChainId === onChainVotedSubmissionId);
        if (votedSubmission) {
          console.log('[CONTEST SUBMISSIONS] Found voted submission:', votedSubmission.id);
          setUserVotedSubmissionId(votedSubmission.id);
        } else {
          console.warn('[CONTEST SUBMISSIONS] Could not find submission with onChainId:', onChainVotedSubmissionId);
        }
      }
    } catch (error) {
      console.error('Failed to fetch on-chain vote:', error);
    }
  }, [voting, useSmartContract, user?.wallet?.address, contestId, submissions]);

  useEffect(() => {
    fetchSubmissions();
    if (user?.wallet?.address) {
      fetchUserVotes();
    }
  }, [contestId, user?.wallet?.address, fetchSubmissions, fetchUserVotes]);
  
  useEffect(() => {
    if (useSmartContract && voting && user?.wallet?.address && submissions.length > 0) {
      fetchOnChainVote();
    }
  }, [useSmartContract, voting, user?.wallet?.address, submissions.length, fetchOnChainVote]);

  async function handleVote(submissionId: string) {
    if (!user?.wallet?.address) {
      login();
      return;
    }

    if (contestStatus !== 'VOTING') {
      alert('❌ Contest is not in voting phase');
      return;
    }

    const hasVoted = userVotes.has(submissionId);
    
    let submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    try {
      // If onChainId is missing, compute it from contract
      if (useSmartContract && voting && !submission.onChainId) {
        console.log('[CONTEST SUBMISSIONS] onChainId missing, computing from contract...');
        console.log('[CONTEST SUBMISSIONS] Query params:', { contestId, submitterAddress: submission.submitter.walletAddress });
        
        // First try to get the stored submission ID
        let onChainId = await voting.getUserSubmissionId(contestId, submission.submitter.walletAddress);
        console.log('[CONTEST SUBMISSIONS] getUserSubmissionId returned:', onChainId, 'type:', typeof onChainId);
        
        // If no stored submission, compute what the ID should be
        if (!onChainId || onChainId === '0x0000000000000000000000000000000000000000000000000000000000000000') {
          console.log('[CONTEST SUBMISSIONS] No stored submission, computing deterministic ID...');
          onChainId = await voting.computeSubmissionId(contestId, submission.submitter.walletAddress);
          console.log('[CONTEST SUBMISSIONS] Computed submission ID:', onChainId, 'type:', typeof onChainId);
        }
        
        if (onChainId && onChainId !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
          // Convert to hex string if it's a BigInt
          let hexId: string;
          if (typeof onChainId === 'bigint') {
            hexId = `0x${(onChainId as bigint).toString(16).padStart(64, '0')}`;
          } else {
            hexId = onChainId as string;
          }
          submission.onChainId = hexId;
          console.log('[CONTEST SUBMISSIONS] Set submission.onChainId to:', hexId);
        } else {
          console.error('[CONTEST SUBMISSIONS] Could not determine on-chain ID');
          alert(`❌ This submission doesn't exist on-chain. The submission may have failed or not been synced properly.`);
          return;
        }
      }
      
      const hasOnChainSubmission = submission?.onChainId !== null && submission?.onChainId !== undefined;
      
      console.log('[CONTEST SUBMISSIONS] Voting check:', {
        useSmartContract,
        hasOnChainSubmission,
        onChainId: submission?.onChainId,
        submissionId
      });
      
      // Use smart contract voting only if submission exists on-chain
      if (useSmartContract && voting && hasOnChainSubmission) {
        console.log('[CONTEST SUBMISSIONS] Using gasless smart contract voting');
        
        if (hasVoted) {
          await voting.removeVote(submissionId, submission?.onChainId || undefined);
        } else {
          await voting.castVote(submissionId, submission?.onChainId || undefined);
        }
        
        // Update local state
        if (hasVoted) {
          setUserVotes(prev => {
            const next = new Set(prev);
            next.delete(submissionId);
            return next;
          });
        } else {
          setUserVotes(prev => new Set(prev).add(submissionId));
        }
        
        // Refresh submissions to get updated vote counts
        await fetchSubmissions();
      } else {
        console.log('[CONTEST SUBMISSIONS] Using database-only voting');
        
        const method = hasVoted ? 'DELETE' : 'POST';
        const res = await fetch('/api/votes', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submissionId,
            walletAddress: user.wallet.address,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          // Update local state
          if (hasVoted) {
            setUserVotes(prev => {
              const next = new Set(prev);
              next.delete(submissionId);
              return next;
            });
          } else {
            setUserVotes(prev => new Set(prev).add(submissionId));
          }
          
          // Refresh submissions to get updated vote counts
          await fetchSubmissions();
        } else {
          alert(`❌ ${data.error || 'Failed to vote'}`);
        }
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert('❌ Failed to vote');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-400">Loading submissions...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 bg-spook-bg/30 rounded-xl">
        <div className="text-6xl mb-4">🎭</div>
        <h3 className="text-2xl font-creepster text-spook-orange mb-2">
          No submissions yet
        </h3>
        <p className="text-gray-400">
          Be the first to submit to this contest!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Submissions ({submissions.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => {
          const isVoted = useSmartContract ? userVotedSubmissionId === submission.id : userVotes.has(submission.id);
          // In smart contract mode: only allow voting if haven't voted, or clicking the same submission to unvote
          const canVote = useSmartContract 
            ? !userVotedSubmissionId || userVotedSubmissionId === submission.id
            : true; // Database mode allows multiple votes
          
          return (
            <SubmissionCard
              key={submission.id}
              id={submission.id}
              title={submission.title}
              description={submission.description || ''}
              submitter={submission.submitter.walletAddress}
              voteCount={submission.voteCount}
              mediaUrl={submission.mediaUrl}
              hasVoted={isVoted}
              onVoteClick={canVote ? () => handleVote(submission.id) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
