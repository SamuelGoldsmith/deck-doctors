CREATE TABLE IF NOT EXISTS employees (
    eid SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    rate NUMERIC(10,2) NOT NULL,
    description VARCHAR(1024)
);

CREATE TABLE IF NOT EXISTS customers (
    cid SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS jobs (
    jid SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state_abr CHAR(2) NOT NULL,
    cid INTEGER NOT NULL REFERENCES customers(cid) ON DELETE CASCADE,
    quote_cost NUMERIC(10,2),
    start_date DATE,
    end_date DATE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS hours (
    hid SERIAL PRIMARY KEY,
    eid INTEGER NOT NULL REFERENCES employees(eid) ON DELETE CASCADE,
    jid INTEGER NOT NULL REFERENCES jobs(jid) ON DELETE CASCADE,
    hours NUMERIC(5,2) NOT NULL CHECK (hours >= 0),
    date_worked DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
    exid SERIAL PRIMARY KEY,
    jid INTEGER NOT NULL REFERENCES jobs(jid) ON DELETE CASCADE,
    description VARCHAR(1024),
    cost NUMERIC(10,2) NOT NULL CHECK (cost >= 0)
);

-- ============================================================
-- Deck Doctors — Job Applications Table
-- Run once against your Neon / PostgreSQL database
-- ============================================================
 
CREATE TABLE IF NOT EXISTS job_applications (
  id                  SERIAL PRIMARY KEY,
 
  -- Applicant info
  first_name          VARCHAR(100)  NOT NULL,
  last_name           VARCHAR(100)  NOT NULL,
  email               VARCHAR(255)  NOT NULL,
  phone               VARCHAR(30)   NOT NULL,
 
  -- Role
  position            VARCHAR(50)   NOT NULL
                        CHECK (position IN ('laborer', 'carpenter', 'painter')),
 
  -- Work details
  experience          VARCHAR(20)   NOT NULL,   -- e.g. '1-3', '5-10', '10+'
  availability        VARCHAR(20)   NOT NULL,   -- e.g. 'immediately', '2-weeks'
  has_driving_license BOOLEAN       NOT NULL,
  has_own_tools       VARCHAR(10),              -- 'yes' | 'no' | 'some' | NULL
 
  -- Free-text
  message             TEXT,
 
  -- Workflow
  status              VARCHAR(20)   NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new', 'reviewing', 'interview', 'hired', 'rejected')),
  notes               TEXT,                     -- internal recruiter notes
 
  -- Timestamps
  submitted_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
 
-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER trg_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
 
-- Useful indexes
CREATE INDEX idx_job_applications_position ON job_applications (position);
CREATE INDEX idx_job_applications_status   ON job_applications (status);
CREATE INDEX idx_job_applications_email    ON job_applications (email);