package com.example.voting.controller;

import com.example.voting.dto.*;
import com.example.voting.service.ElectionService;
import com.example.voting.service.VoteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ElectionController {

    @Autowired
    private ElectionService electionService;

    @Autowired
    private VoteService voteService;

    // GET /api/elections — View active elections (any authenticated user)
    @GetMapping("/elections")
    public ResponseEntity<?> getActiveElections() {
        List<ElectionResponse> elections = electionService.getActiveElections();
        return ResponseEntity.ok(elections);
    }

    // POST /api/vote — Cast a vote (any authenticated user)
    @PostMapping("/vote")
    public ResponseEntity<?> castVote(@Valid @RequestBody VoteRequest voteRequest) {
        voteService.castVote(voteRequest);
        return ResponseEntity.ok(new MessageResponse("Vote cast successfully!"));
    }

    // GET /api/elections/{id}/voted — Check if current user has voted
    @GetMapping("/elections/{id}/voted")
    public ResponseEntity<?> hasUserVoted(@PathVariable Long id) {
        boolean hasVoted = voteService.hasUserVoted(id);
        return ResponseEntity.ok(java.util.Map.of("hasVoted", hasVoted));
    }
}
