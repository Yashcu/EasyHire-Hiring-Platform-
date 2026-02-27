package com.easyhire.service;

import com.easyhire.dto.UpdateProfileRequest;
import com.easyhire.entity.CandidateProfile;
import com.easyhire.repository.CandidateProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class ProfileService {
    private final CandidateProfileRepository profileRepository;

    public ProfileService(CandidateProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public CandidateProfile getProfile(UUID userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Transactional
    public void updateProfile(UUID userId, UpdateProfileRequest request) {
        CandidateProfile profile = getProfile(userId);

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setUniversity(request.getUniversity());
        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setDefaultResumeUrl(request.getDefaultResumeUrl());
        profile.setUpdatedAt(java.time.LocalDateTime.now());

        profileRepository.save(profile);
    }
}