package com.easyhire.repository;

import com.easyhire.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    Optional<Application> findByCandidateIdAndInternshipId(UUID candidateId, UUID internshipId);
    Page<Application> findByCandidateId(UUID candidateId, Pageable pageable);
    Page<Application> findByInternshipId(UUID internshipId, Pageable pageable);
}
