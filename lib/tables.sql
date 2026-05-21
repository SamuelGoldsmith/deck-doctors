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