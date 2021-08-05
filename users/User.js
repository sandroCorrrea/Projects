const sequelize = require('sequelize');
const database  = require('../database/database');

const User = database.define('users', {
    email: {
        type: sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,
    },
})

module.exports = User;