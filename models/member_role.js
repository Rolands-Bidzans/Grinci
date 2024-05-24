const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));

const MemberRole = sequelize.define('MemberRole', {
    name: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
});

module.exports = MemberRole;
