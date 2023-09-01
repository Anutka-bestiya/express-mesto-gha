const routerAuth = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  login,
} = require('../controllers/users');
const { PASS_REGEX } = require('../utils/regex');

routerAuth.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).regex(PASS_REGEX),
  }),
}), login); // авторизация

module.exports = routerAuth;
