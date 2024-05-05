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
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);