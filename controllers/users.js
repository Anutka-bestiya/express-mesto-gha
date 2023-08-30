// const path = require("path");
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
// импортируем модуль jsonwebtoken
const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user'); // данные
const {
  OK_STATUS_CODE,
  HTTP_CREATED_STATUS_CODE,
  // HTTP_BAD_REQUEST_STATUS_CODE,
  // HTTP_UNAUTHORIZED_STATUS_CODE,
  // NOT_FOUND_PAGE_STATUS_CODE,
  // SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
// const UnauthorizedError = require('../errors/unauthorized-err');

// Получение пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK_STATUS_CODE).send(users))
    .catch(next);
  // () => {
  //   res
  //     .status(SERVER_ERROR_STATUS_CODE)
  //     .send({ message: 'Произошла ошибка при запросе пользователей' });
  // });
};

// Создание нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash, // записываем хеш в базу
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(HTTP_CREATED_STATUS_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('При создании пользователя переданы некорректные данные');
        // res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
        //   message: 'При создании пользователя переданы некорректные данные',
        // });
      }
      next(err);
      // else {
      //   res.status(SERVER_ERROR_STATUS_CODE).send({
      //     message: 'Произошла ошибка на сервере при создании пользователя',
      //   });
      // }
    });
};

// Получение данныех пользователя
const getUserProfile = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Не найден пользователь с таким id');
        // res
        //   .status(NOT_FOUND_PAGE_STATUS_CODE)
        //   .send({ message: 'Не найден пользователь с таким id' });
        // return;
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('При получении данных пользователя были переданы некорректные данные');
        // return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
        //   message:
        //     'При получении данных пользователя были переданы некорректные данные',
        // });
      }
      next(err);
      // return res
      //   .status(SERVER_ERROR_STATUS_CODE)
      //   .send({
      //     message:
      //       'Произошла ошибка на сервере при запросе данных пользователя',
      //   });
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id; // _id станет доступен
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Не найден пользователь с таким id');
        // res
        //   .status(NOT_FOUND_PAGE_STATUS_CODE)
        //   .send({ message: 'Не найден пользователь с таким id' });
        // return;
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('При обновлении данных профиля переданы некорректные данные');
        // return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
        //   message: 'При обновлении данных профиля переданы некорректные данные',
        // });
      }
      next(err);
      // return res.status(SERVER_ERROR_STATUS_CODE).send({
      //   message:
      //     'Произошла ошибка на сервере при обновлении данных пользователя',
      // });
    });
};

// Обновление аватара
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id; // _id станет доступен
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Не найден пользователь с таким id');
        // res
        //   .status(NOT_FOUND_PAGE_STATUS_CODE)
        //   .send({ message: 'Не найден пользователь с таким id' });
        // return;
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('При обновлении аватара переданы некорректные данные');
        // return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
        //   message: 'При обновлении аватара переданы некорректные данные',
        // });
      }
      next(err);
      // return res.status(SERVER_ERROR_STATUS_CODE).send({
      //   message:
      //     'Произошла ошибка на сервере при обновлении аватара пользователя',
      // });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      res.send({ message: 'Авторизация прошла успешно!' });
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      // res.send({ token })
      // console.log(token);
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true, // отправлять куки только если запрос пришел с того же домена, защита CSRF
        })
        .end(); // если у ответа нет тела, можно использовать метод end
    })
    // .catch(() => {
  // ошибка аутентификации
  // throw new UnauthorizedError('Неправильные почта или пароль');
  // res
  //   .status(HTTP_BAD_REQUEST_STATUS_CODE)
  //   .send({ message: 'Ошибка аунтификации' });
    // })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  getUserProfile,
  updateProfile,
  updateAvatar,
  login,
};
