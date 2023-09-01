const routerUsers = require('express').Router(); // создали роутер
// const path = require("path");
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserProfile,
  getByIdProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { LINK_REGEX } = require('../utils/regex');

routerUsers.get('/', getUsers);
routerUsers.get('/me', getUserProfile);
routerUsers.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getByIdProfile);
routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile); // PATCH /users/me — обновляет профиль
routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(LINK_REGEX),
  }),
}), updateAvatar); // PATCH /users/me/avatar — обновляет аватар

module.exports = routerUsers;
