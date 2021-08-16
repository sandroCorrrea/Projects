const sequelize = require('sequelize');
const database = require('../database/database');

const Admin = database.define('admins', {
    name: {
        type: sequelize.STRING,
        allowNull: false,
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false,
    },
    cpf: {
        type: sequelize.STRING,
        allowNull: false,
    },
    dathBirth: {
        type: sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize.TEXT,
        allowNull: false,
    },
    phone: {
        type: sequelize.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize.TEXT,
        allowNull: false,
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,
    }
});

// Admin.sync({ force: false });

module.exports = Admin;