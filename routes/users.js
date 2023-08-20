const routerUsers = require('express').Router(); // создали роутер
// const path = require("path");
const {
  getUsers,
  createUser,
  getUserProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.post('/', createUser);
routerUsers.get('/:id', getUserProfile);
routerUsers.patch('/me', updateProfile); // PATCH /users/me — обновляет профиль
routerUsers.patch('/me/avatar', updateAvatar); // PATCH /users/me/avatar — обновляет аватар

module.exports = routerUsers;
