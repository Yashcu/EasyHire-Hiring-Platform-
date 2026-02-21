package com.easyhire.repository;

import com.easyhire.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InternshipRepository extends JpaRepository<Internship, UUID> {
}
