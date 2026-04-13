package com.example.voting.service;

import com.example.voting.dto.VoteRequest;
import com.example.voting.models.*;
import com.example.voting.repository.*;
import com.example.voting.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    /**
     * CORE VOTING LOGIC:
     * 1. Check if the election is ACTIVE
     * 2. Check if the user has already voted in this election
     * 3. Save the vote
     */
    public Vote castVote(VoteRequest voteRequest) {
        // Get the currently authenticated user
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the election
        Election election = electionRepository.findById(voteRequest.getElectionId())
                .orElseThrow(() -> new RuntimeException("Election not found"));

        // STEP 1: Check if election is ACTIVE
        if (election.getStatus() != ElectionStatus.ACTIVE) {
            throw new RuntimeException("This election is CLOSED. You cannot vote.");
        }

        // STEP 2: Check if user already voted in THIS election (prevent double voting)
        if (voteRepository.existsByUserIdAndElectionId(user.getId(), election.getId())) {
            throw new RuntimeException("You have already voted in this election!");
        }

        // Find the candidate
        Candidate candidate = candidateRepository.findById(voteRequest.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Verify the candidate belongs to this election
        if (!candidate.getElection().getId().equals(election.getId())) {
            throw new RuntimeException("This candidate does not belong to the specified election.");
        }

        // STEP 3: Save the vote
        Vote vote = new Vote(user, candidate, election);
        return voteRepository.save(vote);
    }

    /**
     * Check if the current user has already voted in a given election
     */
    public boolean hasUserVoted(Long electionId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return voteRepository.existsByUserIdAndElectionId(userDetails.getId(), electionId);
    }
}
