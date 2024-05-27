const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));

const BudgetStatus = sequelize.define('BudgetStatus', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false,
});

module.exports = BudgetStatus;
