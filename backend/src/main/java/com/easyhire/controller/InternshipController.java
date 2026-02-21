package com.easyhire.controller;

import com.easyhire.dto.CreateInternshipRequest;
import com.easyhire.dto.InternshipResponse;
import com.easyhire.service.InternshipService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/internships")
public class InternshipController {

    private final InternshipService internshipService;

    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @PostMapping
    public ResponseEntity<InternshipResponse> create(
            @Valid @RequestBody CreateInternshipRequest request,
            Authentication authentication) {

        UUID recruiterId = (UUID) authentication.getPrincipal();

        InternshipResponse response =
                internshipService.create(recruiterId, request);

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<List<InternshipResponse>> getOpen() {

        return ResponseEntity.ok(internshipService.getOpenInternships());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipResponse> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(internshipService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InternshipResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody CreateInternshipRequest request,
            Authentication authentication) {

        UUID recruiterId = (UUID) authentication.getPrincipal();

        return ResponseEntity.ok(
                internshipService.update(recruiterId, id, request)
        );
    }
}