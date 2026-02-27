package com.easyhire.service;

import com.easyhire.dto.ApplicationResponse;
import com.easyhire.dto.ApplyRequest;
import com.easyhire.dto.UpdateApplicationStatusRequest;
import com.easyhire.entity.*;
import com.easyhire.exception.BadRequestException;
import com.easyhire.exception.ResourceNotFoundException;
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
                              ApplicationStatusHistoryRepository historyRepository,
                              CandidateProfileRepository candidateProfileRepository) {
        this.applicationRepository = applicationRepository;
        this.internshipRepository = internshipRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
        this.candidateProfileRepository = candidateProfileRepository;
    }

    @Transactional
    public void apply(UUID candidateId, UUID internshipId, ApplyRequest request) {

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("User", candidateId));

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new AccessDeniedException("Only candidates can apply");
        }

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship", internshipId));

        if (internship.getStatus() != InternshipStatus.OPEN) {
            throw new BadRequestException("Internship is not open for applications");
        }

        if (applicationRepository
                .findByCandidateIdAndInternshipId(candidateId, internshipId)
                .isPresent()) {
            throw new BadRequestException("You have already applied");
        }

        CandidateProfile profile = candidateProfileRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", candidateId));

        String resumeToUse = (request.getResumeUrl() != null && !request.getResumeUrl().isBlank())
                ? request.getResumeUrl()
                : profile.getDefaultResumeUrl();

        if (resumeToUse == null || resumeToUse.isBlank()) {
            throw new BadRequestException("No resume provided and no default resume found in profile");
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
                .map(this::mapToResponse);
    }

    public Page<ApplicationResponse> getApplicants(UUID recruiterId,
                                                   UUID internshipId,
                                                   int page,
                                                   int size) {

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship", internshipId));

        if (!internship.getRecruiter().getId().equals(recruiterId)) {
            throw new AccessDeniedException("Not your internship");
        }

        Pageable pageable = PageRequest.of(page, size);

        return applicationRepository
                .findByInternshipId(internshipId, pageable)
                .map(app -> {
                    ApplicationResponse response = mapToResponse(app);
                    response.setCandidateEmail(app.getCandidate().getEmail());
                    response.setResumeUrl(app.getAppliedResumeUrl());

                    candidateProfileRepository.findById(app.getCandidate().getId())
                        .ifPresent(profile -> response.setCandidateName(
                            profile.getFirstName() + " " + profile.getLastName()));

                    return response;
                });
    }

    @Transactional
    public void updateStatus(UUID recruiterId,
                             UUID applicationId,
                             UpdateApplicationStatusRequest request) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

        Internship internship = application.getInternship();

        if (!internship.getRecruiter().getId().equals(recruiterId)) {
            throw new AccessDeniedException("Not your internship");
        }

        ApplicationStatus current = application.getStatus();
        ApplicationStatus next = request.getStatus();

        boolean isTransitionValid = switch (current) {
            case APPLIED -> (next == ApplicationStatus.IN_REVIEW || next == ApplicationStatus.REJECTED);
            case IN_REVIEW -> (next == ApplicationStatus.SHORTLISTED || next == ApplicationStatus.REJECTED);
            case SHORTLISTED -> (next == ApplicationStatus.OFFERED || next == ApplicationStatus.REJECTED);
            case OFFERED, REJECTED -> false;
        };

        if (!isTransitionValid) {
            throw new BadRequestException("Invalid status transition from " + current + " to " + next);
        }

        application.setStatus(next);
        application.setUpdatedAt(LocalDateTime.now());

        applicationRepository.save(application);

        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", recruiterId));

        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(application);
        history.setPreviousStatus(current.name());
        history.setNewStatus(next.name());
        history.setChangedBy(recruiter);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);
    }

    private ApplicationResponse mapToResponse(Application app) {
        ApplicationResponse response = new ApplicationResponse();
        response.setApplicationId(app.getId());
        response.setInternshipId(app.getInternship().getId());
        response.setInternshipTitle(app.getInternship().getTitle());
        response.setStatus(app.getStatus());
        response.setAppliedAt(app.getAppliedAt());
        return response;
    }
}