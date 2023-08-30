const routerUsers = require('express').Router(); // создали роутер
// const path = require("path");
const {
  getUsers,
  getUserProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/me', getUserProfile);
routerUsers.get('/:id', getUserProfile);
routerUsers.patch('/me', updateProfile); // PATCH /users/me — обновляет профиль
routerUsers.patch('/me/avatar', updateAvatar); // PATCH /users/me/avatar — обновляет аватар

module.exports = routerUsers;
