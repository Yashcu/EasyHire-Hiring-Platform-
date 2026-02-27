package com.easyhire.service;

import com.easyhire.dto.LoginRequest;
import com.easyhire.dto.RegisterRequest;
import com.easyhire.entity.CandidateProfile;
import com.easyhire.entity.Role;
import com.easyhire.entity.User;
import com.easyhire.exception.EmailAlreadyExistsException;
import com.easyhire.repository.CandidateProfileRepository;
import com.easyhire.repository.UserRepository;
import com.easyhire.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       CandidateProfileRepository candidateProfileRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public void register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.CANDIDATE) {
            CandidateProfile profile = new CandidateProfile();
            profile.setUser(savedUser);
            profile.setFirstName(request.getFirstName());
            profile.setLastName(request.getLastName());
            profile.setUpdatedAt(LocalDateTime.now());

            candidateProfileRepository.save(profile);
        }
    }

    public String login(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return jwtService.generateToken(user.getId(), user.getRole().name());
    }
}