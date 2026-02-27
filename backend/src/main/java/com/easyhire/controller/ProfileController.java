package com.easyhire.controller;

import com.easyhire.dto.ProfileResponse;
import com.easyhire.dto.UpdateProfileRequest;
import com.easyhire.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<String> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        profileService.updateProfile(userId, request);
        return ResponseEntity.ok("Profile updated successfully");
    }
}