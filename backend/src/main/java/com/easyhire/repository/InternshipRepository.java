package com.easyhire.repository;

import com.easyhire.entity.Internship;
import com.easyhire.entity.InternshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InternshipRepository extends JpaRepository<Internship, UUID> {
    List<Internship> findByStatus(InternshipStatus status);
}
