package com.example.voting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CandidateResult {
    private Long candidateId;
    private String name;
    private String party;
    private Long voteCount;
}
