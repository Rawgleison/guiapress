const { Sequelize } = require('sequelize');

const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'user_guiapress',
    password: 'guiapress123',
    database: 'guiapress',
    timezone: '-03:00',
    logging: false
});

module.exports = connection;