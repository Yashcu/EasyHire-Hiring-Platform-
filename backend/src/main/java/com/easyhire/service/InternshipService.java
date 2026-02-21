package com.easyhire.service;

import com.easyhire.dto.CreateInternshipRequest;
import com.easyhire.dto.InternshipResponse;
import com.easyhire.entity.Internship;
import com.easyhire.entity.InternshipStatus;
import com.easyhire.entity.User;
import com.easyhire.repository.InternshipRepository;
import com.easyhire.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final UserRepository userRepository;

    public InternshipService(InternshipRepository internshipRepository,
                             UserRepository userRepository) {
        this.internshipRepository = internshipRepository;
        this.userRepository = userRepository;
    }

    public InternshipResponse create(UUID recruiterId, CreateInternshipRequest request) {

        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Internship internship = new Internship();
        internship.setRecruiter(recruiter);
        internship.setTitle(request.getTitle());
        internship.setDescription(request.getDescription());
        internship.setLocation(request.getLocation());
        internship.setStipendMin(request.getStipendMin());
        internship.setStipendMax(request.getStipendMax());
        internship.setType(request.getType());
        internship.setStatus(InternshipStatus.DRAFT);
        internship.setCreatedAt(LocalDateTime.now());
        internship.setUpdatedAt(LocalDateTime.now());

        Internship saved = internshipRepository.save(internship);

        return mapToResponse(saved);
    }

    public List<InternshipResponse> getOpenInternships() {

        return internshipRepository.findByStatus(InternshipStatus.OPEN)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public InternshipResponse getById(UUID id) {

        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        return mapToResponse(internship);
    }

    public InternshipResponse update(UUID recruiterId,
                                     UUID internshipId,
                                     CreateInternshipRequest request) {

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        if (!internship.getRecruiter().getId().equals(recruiterId)) {
            throw new AccessDeniedException("Not your internship");
        }

        internship.setTitle(request.getTitle());
        internship.setDescription(request.getDescription());
        internship.setLocation(request.getLocation());
        internship.setStipendMin(request.getStipendMin());
        internship.setStipendMax(request.getStipendMax());
        internship.setType(request.getType());
        internship.setUpdatedAt(LocalDateTime.now());

        Internship updated = internshipRepository.save(internship);

        return mapToResponse(updated);
    }

    private InternshipResponse mapToResponse(Internship internship) {

        InternshipResponse response = new InternshipResponse();
        response.setId(internship.getId());
        response.setTitle(internship.getTitle());
        response.setDescription(internship.getDescription());
        response.setLocation(internship.getLocation());
        response.setStipendMin(internship.getStipendMin());
        response.setStipendMax(internship.getStipendMax());
        response.setType(internship.getType());
        response.setStatus(internship.getStatus());

        return response;
    }
}