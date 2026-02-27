package com.easyhire.specification;

import com.easyhire.entity.Internship;
import com.easyhire.entity.InternshipStatus;
import com.easyhire.entity.InternshipType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

public class InternshipSpecification {

    public static Specification<Internship> hasStatus(List<InternshipStatus> statuses) {
        return (root, query, cb) ->
                (statuses == null || statuses.isEmpty()) ? null :
                        root.get("status").in(statuses);
    }

    public static Specification<Internship> hasType(InternshipType type) {
        return (root, query, cb) ->
                type == null ? null :
                        cb.equal(root.get("type"), type);
    }

    public static Specification<Internship> hasLocation(String location) {
        return (root, query, cb) ->
                location == null ? null :
                        cb.like(cb.lower(root.get("location")),
                                "%" + location.toLowerCase() + "%");
    }

    public static Specification<Internship> titleContains(String keyword) {
        return (root, query, cb) ->
                keyword == null ? null :
                        cb.like(cb.lower(root.get("title")),
                                "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Internship> hasStipendGreaterEqual(BigDecimal min) {
        return (root, query, cb) ->
                min == null ? null : cb.greaterThanOrEqualTo(root.get("stipendMin"), min);
    }

    public static Specification<Internship> hasStipendLessEqual(BigDecimal max) {
        return (root, query, cb) ->
                max == null ? null : cb.lessThanOrEqualTo(root.get("stipendMax"), max);
    }
}