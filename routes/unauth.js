const routerUnauth = require('express').Router(); // создали роутер
const { createUser } = require('../controllers/users');

routerUnauth.post('/', createUser); // регистрация

module.exports = routerUnauth;
