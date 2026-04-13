package com.example.voting.dto;

import com.example.voting.models.ElectionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ElectionResponse {
    private Long id;
    private String title;
    private ElectionStatus status;
    private List<CandidateInfo> candidates;

    @Data
    @AllArgsConstructor
    public static class CandidateInfo {
        private Long id;
        private String name;
        private String party;
    }
}
