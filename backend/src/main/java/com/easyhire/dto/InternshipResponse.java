package com.easyhire.dto;

import com.easyhire.entity.InternshipStatus;
import com.easyhire.entity.InternshipType;

import java.math.BigDecimal;
import java.util.UUID;

public class InternshipResponse {

    private UUID id;
    private String title;
    private String description;
    private String location;
    private BigDecimal stipendMin;
    private BigDecimal stipendMax;
    private InternshipType type;
    private InternshipStatus status;
    private String companyName;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLogoUrl() {
        return companyLogoUrl;
    }

    public void setCompanyLogoUrl(String companyLogoUrl) {
        this.companyLogoUrl = companyLogoUrl;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public void setCompanyId(UUID companyId) {
        this.companyId = companyId;
    }

    private String companyLogoUrl;
    private UUID companyId;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public InternshipStatus getStatus() {
        return status;
    }

    public void setStatus(InternshipStatus status) {
        this.status = status;
    }
}