const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Group = require(path.join(__dirname, 'group'));
const MonitoringEmail = require(path.join(__dirname, 'monitoring_email'));

const Invoice = sequelize.define('Invoice', {
    supplier_name: {
        type: DataTypes.STRING,
    },
    supplier_address: {
        type: DataTypes.STRING,
    },
    customer_name: {
        type: DataTypes.STRING,
    },
    customer_address: {
        type: DataTypes.STRING,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    purchase_date: {
        type: DataTypes.DATE,
    },
    due_date: {
        type: DataTypes.DATE,
    },
    is_paid: {
        type: DataTypes.BOOLEAN,
    },
    paid_date: {
        type: DataTypes.DATE,
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
    },
    email: {
        type: DataTypes.INTEGER,
        references: {
            model: MonitoringEmail,
            key: 'id',
        },
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Invoice;
