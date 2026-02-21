package com.easyhire.specification;

import com.easyhire.entity.Internship;
import com.easyhire.entity.InternshipStatus;
import com.easyhire.entity.InternshipType;
import org.springframework.data.jpa.domain.Specification;

public class InternshipSpecification {

    public static Specification<Internship> hasStatus(InternshipStatus status) {
        return (root, query, cb) ->
                status == null ? null :
                        cb.equal(root.get("status"), status);
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
}