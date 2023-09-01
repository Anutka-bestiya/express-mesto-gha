const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const UnauthorizedError = require('../errors/unauthorized-err');
const { LINK_REGEX } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
    },
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String, // строка
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'О себе должно быть длиной от 2 до 30 символов',
    },
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (url) => LINK_REGEX.test(url),
      message:
        'Введенный URL адрес некорректный, введите корректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String, // строка
    required: true, // обязательное поле
    unique: true,
    validate: {
      validator: (email) => /.+@.+\..+/.test(email),
      message:
        'Введенный email некорректный, введите корректный email',
    },
  },
  password: {
    type: String, // строка
    required: true, // обязательное поле
    select: false, // необходимо добавить поле select чтобы API не возвращал хеш пароля
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
