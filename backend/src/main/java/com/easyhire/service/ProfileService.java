package com.easyhire.service;

import com.easyhire.dto.ProfileResponse;
import com.easyhire.dto.UpdateProfileRequest;
import com.easyhire.entity.CandidateProfile;
import com.easyhire.exception.ResourceNotFoundException;
import com.easyhire.repository.CandidateProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ProfileService {

    private final CandidateProfileRepository profileRepository;

    public ProfileService(CandidateProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        CandidateProfile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", userId));

        return new ProfileResponse(
                profile.getFirstName(),
                profile.getLastName(),
                profile.getUniversity(),
                profile.getBio(),
                profile.getSkills(),
                profile.getPortfolioUrl(),
                profile.getGithubUrl(),
                profile.getDefaultResumeUrl(),
                profile.getUpdatedAt()
        );
    }

    @Transactional
    public void updateProfile(UUID userId, UpdateProfileRequest request) {
        CandidateProfile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", userId));

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setUniversity(request.getUniversity());
        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setDefaultResumeUrl(request.getDefaultResumeUrl());
        profile.setUpdatedAt(LocalDateTime.now());

        profileRepository.save(profile);
    }
}