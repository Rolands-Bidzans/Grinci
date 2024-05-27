const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Invoice = require(path.join(__dirname, 'invoice'));

const Item = sequelize.define('Item', {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    invoice_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Invoice,
            key: 'id',
        },
        allowNull: false
    },
}, {
    timestamps: false,
});

module.exports = Item;
