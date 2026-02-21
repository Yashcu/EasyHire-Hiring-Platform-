package com.easyhire.controller;

import com.easyhire.dto.ApplyRequest;
import com.easyhire.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/internships")
@Tag(name = "Applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> apply(
            @PathVariable UUID id,
            @Valid @RequestBody ApplyRequest request,
            Authentication authentication) {

        UUID candidateId = (UUID) authentication.getPrincipal();

        applicationService.apply(candidateId, id, request);

        return ResponseEntity.status(201).body("Application submitted");
    }
}