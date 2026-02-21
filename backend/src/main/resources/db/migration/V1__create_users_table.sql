CREATE
EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
    id                  UUID PRIMARY KEY      DEFAULT uuid_generate_v4(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    role                VARCHAR(20)  NOT NULL,
    is_active           BOOLEAN               DEFAULT TRUE,
    email_verified      BOOLEAN               DEFAULT FALSE,
    verification_token  VARCHAR(255),
    verification_expiry TIMESTAMP,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT check_role CHECK (role IN ('CANDIDATE', 'RECRUITER', 'ADMIN'))
);