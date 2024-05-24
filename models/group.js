const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));

const Group = sequelize.define('Group', {
    name: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Group;
