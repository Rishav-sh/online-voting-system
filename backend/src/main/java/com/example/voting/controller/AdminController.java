package com.example.voting.controller;

import com.example.voting.dto.*;
import com.example.voting.models.Candidate;
import com.example.voting.models.Election;
import com.example.voting.models.ElectionStatus;
import com.example.voting.service.ElectionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private ElectionService electionService;

    // POST /api/admin/elections — Create a new election
    @PostMapping("/elections")
    public ResponseEntity<?> createElection(@Valid @RequestBody ElectionRequest request) {
        Election election = electionService.createElection(request);
        return ResponseEntity.ok(election);
    }

    // POST /api/admin/elections/{id}/candidates — Add a candidate to an election
    @PostMapping("/elections/{id}/candidates")
    public ResponseEntity<?> addCandidate(@PathVariable Long id, @Valid @RequestBody CandidateRequest request) {
        Candidate candidate = electionService.addCandidate(id, request);
        return ResponseEntity.ok(new MessageResponse("Candidate '" + candidate.getName() + "' added successfully!"));
    }

    // PUT /api/admin/elections/{id}/status — Start or stop an election
    @PutMapping("/elections/{id}/status")
    public ResponseEntity<?> updateElectionStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        ElectionStatus status = ElectionStatus.valueOf(statusStr.toUpperCase());
        Election election = electionService.updateElectionStatus(id, status);
        return ResponseEntity.ok(new MessageResponse("Election '" + election.getTitle() + "' status updated to " + status));
    }

    // GET /api/admin/elections/{id}/results — View election results
    @GetMapping("/elections/{id}/results")
    public ResponseEntity<?> getElectionResults(@PathVariable Long id) {
        List<CandidateResult> results = electionService.getElectionResults(id);
        return ResponseEntity.ok(results);
    }

    // GET /api/admin/elections — View all elections (admin view)
    @GetMapping("/elections")
    public ResponseEntity<?> getAllElections() {
        List<ElectionResponse> elections = electionService.getAllElections();
        return ResponseEntity.ok(elections);
    }
}
