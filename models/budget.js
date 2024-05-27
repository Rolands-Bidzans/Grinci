const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Group = require(path.join(__dirname, 'group'));
const BudgetStatus = require(path.join(__dirname, 'budget_status'));

const Budget = sequelize.define('Budget', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    budget_active_from: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    budget_active_to: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        references: {
            model: BudgetStatus,
            key: 'id',
        },
        allowNull: false
    },
}, {
    timestamps: false,
});

module.exports = Budget;
