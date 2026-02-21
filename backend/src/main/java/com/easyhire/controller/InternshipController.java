package com.easyhire.controller;

import com.easyhire.dto.CreateInternshipRequest;
import com.easyhire.dto.InternshipResponse;
import com.easyhire.dto.UpdateInternshipStatusRequest;
import com.easyhire.entity.InternshipStatus;
import com.easyhire.entity.InternshipType;
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
    public ResponseEntity<?> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) InternshipStatus status,
            @RequestParam(required = false) InternshipType type,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {

        return ResponseEntity.ok(
                internshipService.search(
                        keyword,
                        status,
                        type,
                        location,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
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

    @PatchMapping("/{id}/status")
    public ResponseEntity<InternshipResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateInternshipStatusRequest request,
            Authentication authentication) {

        UUID recruiterId = (UUID) authentication.getPrincipal();

        return ResponseEntity.ok(
                internshipService.updateStatus(recruiterId, id, request)
        );
    }
}