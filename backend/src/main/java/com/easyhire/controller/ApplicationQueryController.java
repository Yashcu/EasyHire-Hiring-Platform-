package com.easyhire.controller;

import com.easyhire.dto.ApplicationResponse;
import com.easyhire.service.ApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class ApplicationQueryController {

    private final ApplicationService applicationService;

    public ApplicationQueryController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping("/applications/me")
    public ResponseEntity<Page<ApplicationResponse>> myApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        UUID candidateId = (UUID) authentication.getPrincipal();

        return ResponseEntity.ok(
                applicationService.getMyApplications(candidateId, page, size)
        );
    }

    @GetMapping("/internships/{id}/applications")
    public ResponseEntity<Page<ApplicationResponse>> applicants(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        UUID recruiterId = (UUID) authentication.getPrincipal();

        return ResponseEntity.ok(
                applicationService.getApplicants(recruiterId, id, page, size)
        );
    }
}