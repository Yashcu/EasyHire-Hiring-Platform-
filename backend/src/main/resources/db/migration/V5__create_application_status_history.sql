CREATE TABLE application_status_history
(
    id              UUID PRIMARY KEY     DEFAULT uuid_generate_v4(),
    application_id  UUID        NOT NULL,
    previous_status VARCHAR(20),
    new_status      VARCHAR(20) NOT NULL,
    changed_by      UUID,
    changed_at      TIMESTAMP   NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_history_application
        FOREIGN KEY (application_id)
            REFERENCES applications (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_history_changed_by
        FOREIGN KEY (changed_by)
            REFERENCES users (id)
            ON DELETE SET NULL
);

CREATE INDEX idx_history_application ON application_status_history (application_id);