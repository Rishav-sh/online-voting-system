package com.example.voting.repository;

import com.example.voting.models.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Boolean existsByUserIdAndElectionId(Long userId, Long electionId);
    Long countByCandidateId(Long candidateId);
}
