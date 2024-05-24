const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const Group = require(path.join(__dirname, 'group'));

const MonitoringEmail = sequelize.define('MonitoringEmail', {
    email: {
        type: DataTypes.STRING,
    },
    client_id: {
        type: DataTypes.STRING,
    },
    client_secret: {
        type: DataTypes.STRING,
    },
    refresh_token: {
        type: DataTypes.STRING,
    },
    is_enabled: {
        type: DataTypes.BOOLEAN,
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
    },
}, {
    timestamps: true,
    createdAt: 'added_at',
    updatedAt: false,
});

module.exports = MonitoringEmail;
