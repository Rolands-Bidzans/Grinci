// Load environment variables from .env file
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

async function createTablesFromSchema() {
    try {
        pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
        });

        const schemaSQL = fs.readFileSync('./src/db/schema.sql', 'utf8');
        await this.pool.query(schemaSQL);
        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Error creating tables from schema:', error);
        throw error;
    }
}

createTablesFromSchema()
