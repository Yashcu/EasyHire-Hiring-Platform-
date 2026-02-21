package com.easyhire.repository;

import com.easyhire.entity.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CandidateProfileRepository
        extends JpaRepository<CandidateProfile, UUID> {
}