CREATE INDEX IF NOT EXISTS idx_internship_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internship_type ON internships(type);
CREATE INDEX IF NOT EXISTS idx_internship_location ON internships(location);
CREATE INDEX IF NOT EXISTS idx_internship_created_at ON internships(created_at);

CREATE INDEX IF NOT EXISTS idx_application_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_application_internship ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_application_status ON applications(status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_application_candidate_internship
    ON applications(candidate_id, internship_id);