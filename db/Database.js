// Load environment variables from .env file
require('dotenv').config();
const { Pool } = require('pg');

class Database {

    async open() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
        });
    }

    async customQuery(query, params = []) {
        try {
            const result = await this.pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertUser(email, password, name = null, surname = null, client_id = null, client_secret = null, refresh_token = null, created_at = new Date()) {
        const query = {
            text: 'INSERT INTO "Users"(name, surname,  email, password, client_id, client_secret, refresh_token, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            values: [name, surname, email, password, client_id, client_secret, refresh_token, created_at],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertGroups(name, created_at = new Date()) {
        const query = {
            text: 'INSERT INTO "Groups"(name, created_at) VALUES($1, $2) RETURNING *',
            values: [name, created_at],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertMemberRoles(id, name) {
        const query = {
            text: 'INSERT INTO "MemberRoles"(id, name) VALUES($1, $2)  RETURNING *',
            values: [id, name],
        };

        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertGroupMembers(userID, groupID, memberRole = 3, joinedAt = new Date()) {
        const query = {
            text: 'INSERT INTO "GroupMembers"(user_id, group_id, member_role, joined_at) VALUES($1, $2, $3, $4)  RETURNING *',
            values: [userID, groupID, memberRole, joinedAt],
        };

        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertBudgetStatuses(id, name) {
        const query = {
            text: 'INSERT INTO "BudgetStatuses"(id, name) VALUES($1, $2)  RETURNING *',
            values: [id, name],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertBudgets(name, amount, budgetActiveFrom = new Date(), budgetActiveTo = new Date(), groupID, status) {
        const query = {
            text: 'INSERT INTO "Budgets"(name, amount, budget_active_from, budget_active_to, group_id, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [name, amount, budgetActiveFrom, budgetActiveTo, groupID, status],
        };
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

    async deleteInvoices(invoiceIds) {
        const query = {
            text: 'DELETE FROM "Invoices" WHERE id = ANY($1) RETURNING *',
            values: [invoiceIds],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertInvice(supplier_name, supplier_address = null, customer_name = null, customer_address = null, total_amount = 0, purchase_date = new Date(), due_date = null, is_paid = false, paid_date = new Date(), group_id, email, created_at = new Date()) {
        const query = {
            text: 'INSERT INTO "Invoices"(supplier_name, supplier_address, customer_name, customer_address, total_amount, purchase_date, due_date, is_paid, paid_date, group_id, email, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            values: [supplier_name, supplier_address, customer_name, customer_address, total_amount, purchase_date, due_date, is_paid, paid_date, group_id, email, created_at],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }
    
}

module.exports = new Database();
