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

-- Hours are NOT stored. Every entry records a start (clock_in_at) and end
-- (clock_out_at) timestamp; the duration is computed at runtime. See the
-- clock-in/out migration block below for the columns and the drop of the
-- legacy stored `hours` column.
CREATE TABLE IF NOT EXISTS hours (
    hid SERIAL PRIMARY KEY,
    eid INTEGER NOT NULL REFERENCES employees(eid) ON DELETE CASCADE,
    jid INTEGER NOT NULL REFERENCES jobs(jid) ON DELETE CASCADE,
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

-- ============================================================
-- Deck Doctors — Hours are derived from start/end, not stored
-- Both logging paths (manual "Quick Add" and employee clock in/out)
-- now record only a start (clock_in_at) and end (clock_out_at). The
-- worked duration is computed at runtime. This migration backfills
-- start/end for legacy manual rows that only had a raw `hours` value
-- (anchored at 08:00 on the date worked so the duration is preserved),
-- then drops the now-derived `hours` column. Guarded so it is a no-op
-- on a fresh database where the column was never created.
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hours' AND column_name = 'hours'
  ) THEN
    UPDATE hours
    SET clock_in_at  = date_worked + INTERVAL '8 hours',
        clock_out_at = date_worked + INTERVAL '8 hours' + (hours::double precision * INTERVAL '1 hour')
    WHERE clock_in_at IS NULL
      AND clock_out_at IS NULL
      AND hours IS NOT NULL;

    ALTER TABLE hours DROP COLUMN hours;
  END IF;
END $$;

-- ============================================================
-- Deck Doctors — On-Site Deck Estimates (estimator tool)
-- A structured, comprehensive deck assessment an estimator fills
-- out on site (signed in via Google). Promoted scalar columns are
-- used for the list/detail views and querying; the full structured
-- form (scope, repairs, stairs, interactive sketch, rates and the
-- computed quote line items) lives in the `data` JSONB column.
--
-- `data` shape (see DeckEstimateData in lib/utils.ts):
--   { workTypes, materials, pressureTreatedRestore, elevation, tiers,
--     totalSqFt, sqFtIsOverride, boardReplacementCount, bondoSpotCount,
--     railingLinearFt, railingCondition, fastenersPopped, stepCount,
--     stringerCount, stairCondition, riseIn, runIn, structuralConcerns,
--     siteAccessNotes, additionalNotes, internalNotes,
--     sketch: { feetPerCell, cols, rows, sections[], strokes[], markers[] },
--     rates: { ...per-unit prices }, laborHours, lineItems[],
--     suggestedTotal, overrideTotal }
-- ============================================================

CREATE TABLE IF NOT EXISTS deck_estimates (
  id              SERIAL PRIMARY KEY,

  -- Who created it (estimator email from the session)
  created_by      VARCHAR(255),

  -- Optional links into the rest of the portal
  cid             INTEGER REFERENCES customers(cid) ON DELETE SET NULL,
  jid             INTEGER REFERENCES jobs(jid)      ON DELETE SET NULL,

  -- Customer + site (promoted for list/search; full detail also in data)
  customer_name   VARCHAR(255)  NOT NULL,
  phone           VARCHAR(30),
  email           VARCHAR(255),
  address         VARCHAR(255)  NOT NULL,
  city            VARCHAR(255),
  state_abr       CHAR(2),

  -- Promoted analytics
  total_sq_ft     NUMERIC(10,2),
  suggested_total NUMERIC(10,2),
  final_quote     NUMERIC(10,2),

  -- Workflow
  status          VARCHAR(20)   NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'ready', 'quoted', 'converted', 'archived')),

  -- Full structured assessment + sketch + pricing
  data            JSONB         NOT NULL DEFAULT '{}'::jsonb,

  -- Geocoded site coordinates (Nominatim, same as jobs)
  latitude        NUMERIC(9,6),
  longitude       NUMERIC(9,6),

  -- Timestamps
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Reuses set_updated_at() defined above
CREATE TRIGGER trg_deck_estimates_updated_at
  BEFORE UPDATE ON deck_estimates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_deck_estimates_status     ON deck_estimates (status);
CREATE INDEX IF NOT EXISTS idx_deck_estimates_cid        ON deck_estimates (cid);
CREATE INDEX IF NOT EXISTS idx_deck_estimates_created_at ON deck_estimates (created_at);