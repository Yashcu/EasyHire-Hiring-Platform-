ALTER TABLE candidate_profiles
    ADD COLUMN bio TEXT,
    ADD COLUMN skills VARCHAR(500),
    ADD COLUMN portfolio_url VARCHAR(500),
    ADD COLUMN github_url VARCHAR(500);