const Sequelize = require('sequelize');
const connection = require('../database/database');
const { STRING, TEXT } = require('sequelize');
const Category = require('../categories/Category');

const Article = connection.define('articles', {
    title: {
        type: STRING,
        allowNull: false
    },
    slug: {
        type: STRING,
        allowNull: false
    },
    body: {
        type: TEXT,
        allowNull: false
    }
})

Category.hasMany(Article);
Article.belongsTo(Category);

//Cria a tabela no banco se ela não existir
Article.sync();

module.exports = Article;