CREATE TABLE companies (
                           id          UUID PRIMARY KEY      DEFAULT uuid_generate_v4(),
                           name        VARCHAR(255) NOT NULL,
                           website_url VARCHAR(255),
                           logo_url    VARCHAR(500),
                           description TEXT,
                           created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
                           updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Link internships to companies
ALTER TABLE internships ADD COLUMN company_id UUID;

ALTER TABLE internships
    ADD CONSTRAINT fk_internship_company
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL;

CREATE INDEX idx_internship_company ON internships (company_id);