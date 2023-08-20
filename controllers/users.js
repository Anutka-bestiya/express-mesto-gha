// const path = require("path");
const User = require('../models/user'); // данные
const {
  OK_STATUS_CODE,
  HTTP_CREATED_STATUS_CODE,
  HTTP_BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_PAGE_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');

// Получение пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_STATUS_CODE).send(users))
    .catch(() => {
      res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Произошла ошибка при запросе пользователей' });
    });
};

// Создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_CREATED_STATUS_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message: 'При создании пользователя переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'Произошла ошибка на сервере при создании пользователя',
        });
      }
    });
};

// Получение данныех пользователя
const getUserProfile = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Не найден пользователь с таким id' });
        return;
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message:
            'При получении данных пользователя были переданы некорректные данные',
        });
      }

      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS_CODE).send({
          message: 'Не найден пользователь с таким id',
        });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({
          message:
            'Произошла ошибка на сервере при запросе данных пользователя',
        });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id; // _id станет доступен
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Не найден пользователь с таким id' });
        return;
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS_CODE).send({
          message: 'Не найден пользователь с таким id',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message: 'При обновлении данных профиля переданы некорректные данные',
        });
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message:
          'Произошла ошибка на сервере при обновлении данных пользователя',
      });
    });
};

// Обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id; // _id станет доступен
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Не найден пользователь с таким id' });
        return;
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS_CODE).send({
          message: 'Не найден пользователь с таким id',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message: 'При обновлении аватара переданы некорректные данные',
        });
      }

      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message:
          'Произошла ошибка на сервере при обновлении аватара пользователя',
      });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserProfile,
  updateProfile,
  updateAvatar,
};
