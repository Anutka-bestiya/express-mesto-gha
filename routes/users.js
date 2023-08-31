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

routerUsers.get('/', getUsers);
routerUsers.get('/me', getUserProfile);
routerUsers.get('/:id', getByIdProfile);
routerUsers.patch('/me', updateProfile); // PATCH /users/me — обновляет профиль
routerUsers.patch('/me/avatar', updateAvatar); // PATCH /users/me/avatar — обновляет аватар

module.exports = routerUsers;
