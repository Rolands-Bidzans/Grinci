const path = require('path');

const sequelize = require(path.join(__dirname, 'index'));
const User = require(path.join(__dirname, '..', 'models', 'user'));
const Group = require(path.join(__dirname, '..', 'models', 'group'));
const BudgetStatus = require(path.join(__dirname, '..', 'models', 'budget_status'));
const Budget = require(path.join(__dirname, '..', 'models', 'budget'));
const MemberRole = require(path.join(__dirname, '..', 'models', 'member_role'));
const GroupMember = require(path.join(__dirname, '..', 'models', 'group_member'));
const MonitoringEmail = require(path.join(__dirname, '..', 'models', 'monitoring_email'));
const Invoice = require(path.join(__dirname, '..', 'models', 'invoice'));
const Item = require(path.join(__dirname, '..', 'models', 'item'));

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // This will drop the tables first and then recreate them. Use { alter: true } for production.
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing the database:', error);
    }
};

syncDatabase();
