package com.easyhire.service;

import com.easyhire.dto.RegisterRequest;
import com.easyhire.entity.CandidateProfile;
import com.easyhire.entity.Role;
import com.easyhire.entity.User;
import com.easyhire.exception.EmailAlreadyExistsException;
import com.easyhire.repository.CandidateProfileRepository;
import com.easyhire.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       CandidateProfileRepository candidateProfileRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(RegisterRequest request) {

        // 1. Check duplicate email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        // 2. Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // 3. If candidate → create profile
        if (request.getRole() == Role.CANDIDATE) {
            CandidateProfile profile = new CandidateProfile();
            profile.setUser(savedUser);
            profile.setFirstName(request.getFirstName());
            profile.setLastName(request.getLastName());
            profile.setUpdatedAt(LocalDateTime.now());

            candidateProfileRepository.save(profile);
        }
    }
}