// const path = require("path");
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user'); // данные
const {
  OK_STATUS_CODE,
  HTTP_CREATED_STATUS_CODE,
} = require('../utils/status_code');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

// Получение пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK_STATUS_CODE).send(users))
    .catch(next);
};

// Создание нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) { throw new ConflictError('Пользователь с таким email существует'); } else {
        bcrypt
          .hash(password, 10)
          .then((hash) => {
            User
              .create({
                email,
                password: hash, // записываем хеш в базу
                name,
                about,
                avatar,
              })
              .then((newUser) => {
                const { _id } = newUser;

                res.status(HTTP_CREATED_STATUS_CODE).send({
                  email,
                  name,
                  about,
                  avatar,
                  _id,
                });
              })
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  throw new BadRequestError('При создании пользователя переданы некорректные данные');
                }
              });
          });
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email существует');
      }
      next(err);
    });
};

// Получение персональных данныех пользователя
const getUserProfile = (req, res, next) => {
  // const id = req.user._id; // _id станет доступен
  User.findById(req.user._id)
    .then((user) => {
      if (user) { res.status(OK_STATUS_CODE).send(user); }
      throw new NotFoundError('Не найден пользователь с таким id');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('При получении данных пользователя были переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Получение данныех пользователя по id
const getByIdProfile = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Не найден пользователь с таким id');
      }
      return res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('При получении данных пользователя были переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Обновление профиля
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  // const owner = req.user._id; // _id станет доступен
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Не найден пользователь с таким id');
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('При обновлении данных профиля переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Обновление аватара
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  // const owner = req.user._id; // _id станет доступен
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Не найден пользователь с таким id');
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('При обновлении аватара переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      // res.send({ token })
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true, // отправлять куки только если запрос пришел с того же домена, защита CSRF
        })
        // аутентификация успешна! пользователь в переменной user
        .send({ _id: user._id, message: 'Авторизация прошла успешно!' })
        .end(); // если у ответа нет тела, можно использовать метод end;
    })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  getUserProfile,
  getByIdProfile,
  updateProfile,
  updateAvatar,
  login,
};
