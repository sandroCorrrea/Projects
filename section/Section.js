const sequelize  = require('sequelize');
const connection = require('../database/database');
const Article    = require('../article/ArticleModel');

const Section = connection.define('sections', {
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
        allowNull: false,
    }
})

Section.belongsTo(Article);

module.exports = Section;
