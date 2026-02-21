CREATE TABLE applications
(
    id                 UUID PRIMARY KEY      DEFAULT uuid_generate_v4(),
    candidate_id       UUID         NOT NULL,
    internship_id      UUID         NOT NULL,
    status             VARCHAR(20)  NOT NULL,
    applied_resume_url VARCHAR(500) NOT NULL,
    applied_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_application_candidate
        FOREIGN KEY (candidate_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_application_internship
        FOREIGN KEY (internship_id)
            REFERENCES internships (id)
            ON DELETE CASCADE,

    CONSTRAINT unique_candidate_internship
        UNIQUE (candidate_id, internship_id),

    CONSTRAINT check_application_status CHECK (
        status IN ('APPLIED', 'IN_REVIEW', 'SHORTLISTED', 'REJECTED', 'OFFERED')
        )
);

CREATE INDEX idx_application_candidate ON applications (candidate_id);
CREATE INDEX idx_application_internship ON applications (internship_id);