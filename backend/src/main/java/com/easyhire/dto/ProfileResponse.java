package com.easyhire.dto;

import java.time.LocalDateTime;

public class ProfileResponse {

    private String firstName;
    private String lastName;
    private String university;
    private String bio;
    private String skills;
    private String portfolioUrl;
    private String githubUrl;
    private String defaultResumeUrl;
    private LocalDateTime updatedAt;

    public ProfileResponse(String firstName, String lastName, String university,
                           String bio, String skills, String portfolioUrl,
                           String githubUrl, String defaultResumeUrl,
                           LocalDateTime updatedAt) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.university = university;
        this.bio = bio;
        this.skills = skills;
        this.portfolioUrl = portfolioUrl;
        this.githubUrl = githubUrl;
        this.defaultResumeUrl = defaultResumeUrl;
        this.updatedAt = updatedAt;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUniversity() {
        return university;
    }

    public String getBio() {
        return bio;
    }

    public String getSkills() {
        return skills;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getDefaultResumeUrl() {
        return defaultResumeUrl;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
