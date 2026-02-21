package com.easyhire.repository;

import com.easyhire.entity.Internship;
import com.easyhire.entity.InternshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface InternshipRepository extends
        JpaRepository<Internship, UUID>,
        JpaSpecificationExecutor<Internship> {
    List<Internship> findByStatus(InternshipStatus status);
}
