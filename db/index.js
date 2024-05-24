const { Sequelize } = require('sequelize');
const path = require('path');
const config = require(path.join(__dirname, 'config'));

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

module.exports = sequelize;
