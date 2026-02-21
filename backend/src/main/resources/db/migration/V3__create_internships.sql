CREATE TABLE internships
(
    id           UUID PRIMARY KEY      DEFAULT uuid_generate_v4(),
    recruiter_id UUID         NOT NULL,
    title        VARCHAR(255) NOT NULL,
    description  TEXT         NOT NULL,
    location     VARCHAR(255) NOT NULL,
    stipend_min  NUMERIC(10, 2),
    stipend_max  NUMERIC(10, 2),
    type         VARCHAR(20)  NOT NULL,
    status       VARCHAR(20)  NOT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_internship_recruiter
        FOREIGN KEY (recruiter_id)
            REFERENCES users (id)
            ON DELETE RESTRICT,

    CONSTRAINT check_stipend_range CHECK (stipend_min <= stipend_max),
    CONSTRAINT check_type CHECK (type IN ('REMOTE', 'ONSITE', 'HYBRID')),
    CONSTRAINT check_status CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED'))
);

CREATE INDEX idx_internship_recruiter ON internships (recruiter_id);
CREATE INDEX idx_internship_status ON internships (status);