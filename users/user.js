const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
})

//Cria a tabela no banco se ela não existir
User.sync();

module.exports = User;