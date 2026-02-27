package com.easyhire.dto;

import com.easyhire.entity.InternshipType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class CreateInternshipRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String location;

    private BigDecimal stipendMin;
    private BigDecimal stipendMax;

    private UUID companyId;

    @NotNull
    private InternshipType type;

    public UUID getCompanyId() {
        return companyId;
    }

    public void setCompanyId(UUID companyId) {
        this.companyId = companyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getStipendMin() {
        return stipendMin;
    }

    public void setStipendMin(BigDecimal stipendMin) {
        this.stipendMin = stipendMin;
    }

    public BigDecimal getStipendMax() {
        return stipendMax;
    }

    public void setStipendMax(BigDecimal stipendMax) {
        this.stipendMax = stipendMax;
    }

    public InternshipType getType() {
        return type;
    }

    public void setType(InternshipType type) {
        this.type = type;
    }
}