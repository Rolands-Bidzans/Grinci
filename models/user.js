const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
    },
    surname: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
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
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = User;
