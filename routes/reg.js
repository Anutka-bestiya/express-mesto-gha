const routerReg = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
} = require('../controllers/users');
const { LINK_REGEX, PASS_REGEX } = require('../utils/regex');

routerReg.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(LINK_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).regex(PASS_REGEX),
  }),
}), createUser); // регистрация

module.exports = routerReg;
