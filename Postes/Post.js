var sequelize = require('sequelize');
var database = require('../database/database');

const Post = database.define('postes', {
    title: {
        type: sequelize.STRING,
        allowNull: false,
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false,
    },
    body: {
        type: sequelize.TEXT,
        allowNull: false
    }
});

Post.sync({ force: false });

module.exports = Post;