package com.easyhire.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplyRequest {

    @NotBlank
    private String resumeUrl;

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}