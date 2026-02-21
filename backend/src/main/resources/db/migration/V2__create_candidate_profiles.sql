CREATE TABLE candidate_profiles
(
    user_id            UUID PRIMARY KEY,
    first_name         VARCHAR(100) NOT NULL,
    last_name          VARCHAR(100) NOT NULL,
    university         VARCHAR(255),
    default_resume_url VARCHAR(500),
    updated_at         TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_candidate_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);