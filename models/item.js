const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Invoice = require(path.join(__dirname, 'invoice'));

const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    invoice_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Invoice,
            key: 'id',
        },
    },
}, {
    timestamps: false,
});

module.exports = Item;
