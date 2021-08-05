const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');

const connection = new Sequelize('clientes', 'root', 'scrj123456', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;