const { Sequelize } = require('sequelize');

const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'user_guiapress',
    password: 'guiapress123',
    database: 'guiapress'
});

module.exports = connection;