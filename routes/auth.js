const routerAuth = require('express').Router(); // создали роутер
const {
  login,
} = require('../controllers/users');

routerAuth.post('/', login); // авторизация

module.exports = routerAuth;
