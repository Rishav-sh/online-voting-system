package com.example.voting.service;

import com.example.voting.dto.*;
import com.example.voting.models.*;
import com.example.voting.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElectionService {

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRepository voteRepository;

    // ======== Admin: Create Election ========
    public Election createElection(ElectionRequest request) {
        Election election = new Election(
                request.getTitle(),
                ElectionStatus.ACTIVE,
                LocalDateTime.now(),
                null
        );
        return electionRepository.save(election);
    }

    // ======== Admin: Add Candidate to Election ========
    public Candidate addCandidate(Long electionId, CandidateRequest request) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found with id: " + electionId));

        Candidate candidate = new Candidate(request.getName(), request.getParty(), election);
        return candidateRepository.save(candidate);
    }

    // ======== Admin: Change Election Status ========
    public Election updateElectionStatus(Long electionId, ElectionStatus status) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found with id: " + electionId));

        election.setStatus(status);
        if (status == ElectionStatus.CLOSED) {
            election.setEndDate(LocalDateTime.now());
        }
        return electionRepository.save(election);
    }

    // ======== Public: Get All Active Elections ========
    public List<ElectionResponse> getActiveElections() {
        List<Election> elections = electionRepository.findByStatus(ElectionStatus.ACTIVE);
        return elections.stream().map(this::toElectionResponse).collect(Collectors.toList());
    }

    // ======== Public: Get All Elections ========
    public List<ElectionResponse> getAllElections() {
        List<Election> elections = electionRepository.findAll();
        return elections.stream().map(this::toElectionResponse).collect(Collectors.toList());
    }

    // ======== Admin: Get Election Results ========
    public List<CandidateResult> getElectionResults(Long electionId) {
        electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found with id: " + electionId));

        List<Candidate> candidates = candidateRepository.findByElectionId(electionId);

        return candidates.stream().map(candidate -> {
            Long voteCount = voteRepository.countByCandidateId(candidate.getId());
            return new CandidateResult(
                    candidate.getId(),
                    candidate.getName(),
                    candidate.getParty(),
                    voteCount
            );
        }).collect(Collectors.toList());
    }

    // ======== Helper: Convert Election to ElectionResponse ========
    private ElectionResponse toElectionResponse(Election election) {
        List<Candidate> candidates = candidateRepository.findByElectionId(election.getId());
        List<ElectionResponse.CandidateInfo> candidateInfos = candidates.stream()
                .map(c -> new ElectionResponse.CandidateInfo(c.getId(), c.getName(), c.getParty()))
                .collect(Collectors.toList());
        return new ElectionResponse(election.getId(), election.getTitle(), election.getStatus(), candidateInfos);
    }
}
