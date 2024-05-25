const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Invoice = require(path.join(__dirname, 'invoice'));

const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
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
