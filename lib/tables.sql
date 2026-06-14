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

-- ============================================================
-- Deck Doctors — Estimate Requests Table
-- Run once against your Neon / PostgreSQL database
-- ============================================================

CREATE TABLE IF NOT EXISTS estimate_requests (
  id                  SERIAL PRIMARY KEY,

  -- Contact info
  first_name          VARCHAR(100)  NOT NULL,
  last_name           VARCHAR(100)  NOT NULL,
  email               VARCHAR(255)  NOT NULL,
  phone               VARCHAR(30)   NOT NULL,
  address             VARCHAR(255)  NOT NULL,

  -- Project details
  service_type        VARCHAR(30)   NOT NULL
                        CHECK (service_type IN ('restoration', 'new_build', 'repair', 'staining_sealing', 'inspection')),

  -- Free-text
  message             TEXT,

  -- Workflow
  status              VARCHAR(20)   NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new', 'reviewing', 'quoted', 'scheduled', 'won', 'lost')),
  notes               TEXT,                     -- internal sales notes

  -- Timestamps
  submitted_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Migration: drop the old per-field project-detail columns in favor of a
-- single free-text `message` field (no-op on a fresh database).
ALTER TABLE estimate_requests DROP COLUMN IF EXISTS deck_material;
ALTER TABLE estimate_requests DROP COLUMN IF EXISTS deck_size;
ALTER TABLE estimate_requests DROP COLUMN IF EXISTS timeline;

-- Reuses set_updated_at() defined above
CREATE TRIGGER trg_estimate_requests_updated_at
  BEFORE UPDATE ON estimate_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Useful indexes
CREATE INDEX idx_estimate_requests_service_type ON estimate_requests (service_type);
CREATE INDEX idx_estimate_requests_status       ON estimate_requests (status);
CREATE INDEX idx_estimate_requests_email        ON estimate_requests (email);

-- ============================================================
-- Deck Doctors — Employee Portal Credentials
-- Adds optional username/password login for the "employee" role,
-- and documents the existing `users` table (Google "owner" accounts).
-- ============================================================

ALTER TABLE employees ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS password VARCHAR(255);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255)
);

-- ============================================================
-- Deck Doctors — Clock In / Clock Out + GPS Geofencing
-- Adds geocoded job coordinates and clock-in/out timestamps +
-- coordinates to hours, plus a flag for whether the employee's
-- location was verified within 1 mile of the job site.
-- ============================================================

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);

ALTER TABLE hours ADD COLUMN IF NOT EXISTS clock_in_at TIMESTAMPTZ;
ALTER TABLE hours ADD COLUMN IF NOT EXISTS clock_out_at TIMESTAMPTZ;
ALTER TABLE hours ADD COLUMN IF NOT EXISTS clock_in_latitude NUMERIC(9,6);
ALTER TABLE hours ADD COLUMN IF NOT EXISTS clock_in_longitude NUMERIC(9,6);
ALTER TABLE hours ADD COLUMN IF NOT EXISTS clock_out_latitude NUMERIC(9,6);
ALTER TABLE hours ADD COLUMN IF NOT EXISTS clock_out_longitude NUMERIC(9,6);
ALTER TABLE hours ADD COLUMN IF NOT EXISTS location_verified BOOLEAN;