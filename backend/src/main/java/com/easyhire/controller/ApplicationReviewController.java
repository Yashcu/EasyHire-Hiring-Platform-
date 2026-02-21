package com.easyhire.controller;

import com.easyhire.dto.UpdateApplicationStatusRequest;
import com.easyhire.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/applications")
@Tag(name = "Applications")
public class ApplicationReviewController {

    private final ApplicationService applicationService;

    public ApplicationReviewController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            Authentication authentication) {

        UUID recruiterId = (UUID) authentication.getPrincipal();

        applicationService.updateStatus(recruiterId, id, request);

        return ResponseEntity.ok("Application status updated");
    }
}