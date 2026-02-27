package com.easyhire.service;

import com.easyhire.dto.ApplicationResponse;
import com.easyhire.dto.ApplyRequest;
import com.easyhire.dto.UpdateApplicationStatusRequest;
import com.easyhire.entity.*;
import com.easyhire.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;
    private final UserRepository userRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              InternshipRepository internshipRepository,
                              UserRepository userRepository,
                              ApplicationStatusHistoryRepository historyRepository, CandidateProfileRepository candidateProfileRepository) {
        this.applicationRepository = applicationRepository;
        this.internshipRepository = internshipRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
        this.candidateProfileRepository = candidateProfileRepository;
    }

    @Transactional
    public void apply(UUID candidateId, UUID internshipId, ApplyRequest request) {

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new AccessDeniedException("Only candidates can apply");
        }

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        if (internship.getStatus() != InternshipStatus.OPEN) {
            throw new IllegalStateException("Internship is not open for applications");
        }

        if (applicationRepository
                .findByCandidateIdAndInternshipId(candidateId, internshipId)
                .isPresent()) {
            throw new IllegalStateException("You have already applied");
        }

        CandidateProfile profile = candidateProfileRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String resumeToUse = (request.getResumeUrl() != null && !request.getResumeUrl().isBlank())
                ? request.getResumeUrl()
                : profile.getDefaultResumeUrl();

        if (resumeToUse == null || resumeToUse.isBlank()) {
            throw new IllegalStateException("No resume provided and no default resume found in profile");
        }

        Application application = new Application();
        application.setCandidate(candidate);
        application.setInternship(internship);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedResumeUrl(resumeToUse);
        application.setAppliedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(saved);
        history.setPreviousStatus(null);
        history.setNewStatus(ApplicationStatus.APPLIED.name());
        history.setChangedBy(null);
        history.setChangedAt(LocalDateTime.now());

        historyRepository.save(history);
    }

    public Page<ApplicationResponse> getMyApplications(UUID candidateId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return applicationRepository
                .findByCandidateId(candidateId, pageable)
                .map(app -> {
                    ApplicationResponse response = new ApplicationResponse();
                    response.setApplicationId(app.getId());
                    response.setInternshipId(app.getInternship().getId());
                    response.setInternshipTitle(app.getInternship().getTitle());
                    response.setStatus(app.getStatus());
                    response.setAppliedAt(app.getAppliedAt());
                    return response;
                });
    }

    public Page<ApplicationResponse> getApplicants(UUID recruiterId,
                                                   UUID internshipId,
                                                   int page,
                                                   int size) {

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        if (!internship.getRecruiter().getId().equals(recruiterId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not your internship");
        }

        Pageable pageable = PageRequest.of(page, size);

        return applicationRepository
                .findByInternshipId(internshipId, pageable)
                .map(app -> {
                    ApplicationResponse response = new ApplicationResponse();
                    response.setApplicationId(app.getId());
                    response.setInternshipId(app.getInternship().getId());
                    response.setInternshipTitle(app.getInternship().getTitle());
                    response.setCandidateEmail(app.getCandidate().getEmail());
                    response.setResumeUrl(app.getAppliedResumeUrl());

                    // Fetch candidate profile to get the name (if it exists)
                    candidateProfileRepository.findById(app.getCandidate().getId())
                        .ifPresent(profile -> response.setCandidateName(
                            profile.getFirstName() + " " + profile.getLastName()));

                    response.setStatus(app.getStatus());
                    response.setAppliedAt(app.getAppliedAt());
                    return response;
                });
    }
    @Transactional
    public void updateStatus(UUID recruiterId,
                             UUID applicationId,
                             UpdateApplicationStatusRequest request) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Internship internship = application.getInternship();

        // Ownership check
        if (!internship.getRecruiter().getId().toString().equals(recruiterId.toString())) {
            throw new org.springframework.security.access.AccessDeniedException("Not your internship");
        }

        ApplicationStatus current = application.getStatus();
        ApplicationStatus next = request.getStatus();

        // Transition validation
        boolean isTransitionValid = switch (current) {
            case APPLIED -> (next == ApplicationStatus.IN_REVIEW || next == ApplicationStatus.REJECTED);
            case IN_REVIEW -> (next == ApplicationStatus.SHORTLISTED || next == ApplicationStatus.REJECTED);
            case SHORTLISTED -> (next == ApplicationStatus.OFFERED || next == ApplicationStatus.REJECTED);
            case OFFERED, REJECTED -> false; // Terminal states
        };

        if (!isTransitionValid) {
            throw new IllegalStateException("Invalid status transition from " + current + " to " + next);
        }

        application.setStatus(next);
        application.setUpdatedAt(java.time.LocalDateTime.now());

        applicationRepository.save(application);

        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(application);
        history.setPreviousStatus(current.name());
        history.setNewStatus(next.name());
        history.setChangedBy(recruiter);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);
    }
}