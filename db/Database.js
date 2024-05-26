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

    async customQuery(query) {
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertUser(username, email, password, refresh_token = null, name = null, surname = null, created_at = new Date()) {
        const query = {
            text: 'INSERT INTO "Users"(username, email, password, refresh_token, name, surname, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            values: [username, email, password, refresh_token, name, surname, created_at],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertTags(group_id, name, color=null) {
        const query = {
            text: 'INSERT INTO "Tags"(group_id, name, color) VALUES($1, $2, $3) RETURNING *',
            values: [group_id, name, color],
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

    async insertBudgets(name, groupID, status, amount = 0, budgetActiveFrom = new Date(), budgetActiveTo = new Date()) {
        const query = {
            text: 'INSERT INTO "Budgets"(name, group_id, status, amount, budget_active_from, budget_active_to) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [name, groupID, status, amount, budgetActiveFrom, budgetActiveTo],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertInvoice(total_amount, is_paid, group_id, monitoring_email, tag_id = 1, customer_name = null, customer_address = null, purchase_date  = null, due_date = null, invoice_number = null, supplier_name = null, supplier_Address = null, supplier_phone_number = null, supplier_website = null, paid_date = null, created_at = new Date()) {
        const query = {
            text: 'INSERT INTO "Invoices"(total_amount, is_paid, group_id, monitoring_email, tag_id, customer_name, customer_address, purchase_date, due_date, invoice_number, supplier_name, supplier_Address, supplier_phone_number, supplier_website, paid_date, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
            values: [total_amount, is_paid, group_id, monitoring_email, tag_id, customer_name, customer_address, purchase_date, due_date, invoice_number, supplier_name, supplier_Address, supplier_phone_number, supplier_website, paid_date, created_at],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertItems(description, invoice_id, quantity = null, total_amount = null, unitPrice = null) {
        const query = {
            text: 'INSERT INTO "Items"(description, invoice_id, quantity, total_amount, unit_price) VALUES($1, $2, $3, $4, $5) RETURNING *',
            values: [description, invoice_id, quantity, total_amount, unitPrice],
        };
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error;
        }
    }

    async insertMonitoringEmail(email, group_id, is_enabled=false, next_checking_date = new Date(), client_id=null, client_secret=null, refresh_token=null, added_at = new Date()) {
        const query = {
            text: 'INSERT INTO "MonitoringEmails"(email, group_id, is_enabled, next_checking_date, client_id, client_secret, refresh_token, added_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            values: [email, group_id, is_enabled, next_checking_date, client_id, client_secret, refresh_token, added_at],
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
    
}

module.exports = new Database();
