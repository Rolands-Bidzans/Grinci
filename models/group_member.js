const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const User = require(path.join(__dirname, 'user'));
const Group = require(path.join(__dirname, 'group'));
const MemberRole = require(path.join(__dirname, 'member_role'));

const GroupMember = sequelize.define('GroupMember', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
    },
    member_role: {
        type: DataTypes.INTEGER,
        references: {
            model: MemberRole,
            key: 'id',
        },
    },
}, {
    timestamps: true,
    createdAt: 'joined_at',
    updatedAt: false,
    primaryKey: 'user_id, group_id',
});

module.exports = GroupMember;
