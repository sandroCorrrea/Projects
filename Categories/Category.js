const sequelize = require('sequelize');
const database = require('../database/database');

const Category = database.define('categories', {
    title: {
        type: sequelize.STRING,
        allowNull: false,
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false,
    }
});

// Category.sync({ force: true });

module.exports = Category;