// Load environment variables from .env file
require('dotenv').config();
const { Pool } = require('pg');
class Database {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
        });
    }

    async insertUser(name = null, surname = null, email, password, client_id = null, client_secret = null, refresh_token = null) {
        const query = {
            text: 'INSERT INTO users(name, surname,  email, password, client_id, client_secret, refresh_token) VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [name, surname, email, password, client_id, client_secret, refresh_token],
        };
        try {
            const result = await this.pool.query(query);
            return result.rowCount;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async getAllUsers() {
        const query = 'SELECT * FROM users';
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = new Database();
