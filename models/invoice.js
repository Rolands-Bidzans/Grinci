const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Group = require(path.join(__dirname, 'group'));
const Tag = require(path.join(__dirname, 'tag'));
const MonitoringEmail = require(path.join(__dirname, 'monitoring_email'));

const Invoice = sequelize.define('Invoice', {
    customer_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customer_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    purchase_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    invoice_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    supplier_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    supplier_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    supplier_phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    supplier_website: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    paid_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
        allowNull: false
    },
    monitoring_email: {
        type: DataTypes.INTEGER,
        references: {
            model: MonitoringEmail,
            key: 'id'
        },
        allowNull: false,
    },
    tag_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Tag,
            key: 'id',
        },
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Invoice;
