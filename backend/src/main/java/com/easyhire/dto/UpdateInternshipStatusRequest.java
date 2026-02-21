package com.easyhire.dto;

import com.easyhire.entity.InternshipStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateInternshipStatusRequest {

    @NotNull
    private InternshipStatus status;

    public InternshipStatus getStatus() {
        return status;
    }

    public void setStatus(InternshipStatus status) {
        this.status = status;
    }
}