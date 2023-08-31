const routerAuth = require('express').Router(); // создали роутер
const {
  createUser,
  login,
} = require('../controllers/users');

routerAuth.post('/signup', createUser); // регистрация
routerAuth.post('/signin', login); // авторизация

module.exports = routerAuth;
