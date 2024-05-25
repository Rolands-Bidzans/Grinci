const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Group = require(path.join(__dirname, 'group'));

const Tags = sequelize.define('Tags', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
        allowNull: false
    }
}, {
    timestamps: false,
});

module.exports = Tags;