-- schema.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    client_id VARCHAR(255),
    client_secret VARCHAR(255),
    refresh_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE budget_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE budget (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    amount DECIMAL(10, 2),
    budget_active_from TIMESTAMP NOT NULL,
    budget_active_to TIMESTAMP NOT NULL,
    group_id INTEGER REFERENCES groups(id),
    status INTEGER REFERENCES budget_statuses(id)
);

CREATE TABLE member_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE group_members (
    user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id),
    member_role INTEGER REFERENCES member_roles(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id)
);

CREATE TABLE monitoring_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    client_id VARCHAR(255),
    client_secret VARCHAR(255),
    refresh_token VARCHAR(255),
    is_enabled BOOLEAN,
    group_id INTEGER REFERENCES groups(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255),
    supplier_address VARCHAR(255),
    customer_name VARCHAR(255),
    customer_address VARCHAR(255),
    total_amount DECIMAL(10, 2),
    purchase_date TIMESTAMP,
    due_date TIMESTAMP,
    is_paid BOOLEAN,
    paid_date TIMESTAMP,
    group_id INTEGER REFERENCES groups(id),
    email INTEGER REFERENCES monitoring_emails(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    amount DECIMAL(10, 2),
    price DECIMAL(10, 2),
    invoice_id INTEGER REFERENCES invoices(id)
);
