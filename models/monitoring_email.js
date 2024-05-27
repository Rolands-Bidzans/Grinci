const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Group = require(path.join(__dirname, 'group'));

const MonitoringEmail = sequelize.define('MonitoringEmail', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    client_secret: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
        allowNull: false
    },
    next_checking_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW 
    },
}, {
    timestamps: true,
    createdAt: 'added_at',
    updatedAt: false,
});

module.exports = MonitoringEmail;
