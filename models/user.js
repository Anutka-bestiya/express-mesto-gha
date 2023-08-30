const mongoose = require('mongoose');
const validator = require('validator'); // библиотека для проверки и валидации данных в Node.js.

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    minlength: [2, 'Минимальное количество символов для поля "name" - 2'], // минимальная длина имени — 2 символа
    maxlength: [
      30,
      'Максимальное количество символов для поля "name" - 30'], // а максимальная — 30 символов
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String, // строка
    minlength: [2, 'Минимальное количество символов для поля "about" - 2'], // минимальная длина имени — 2 символа
    maxlength: [
      30,
      'Максимальное количество символов для поля "about" - 30'], // а максимальная — 30 символов
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message:
        'Введенный URL адрес некорректный, введите корректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String, // строка
    required: [true, 'Поле "email" должно быть заполнено обязательно'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
    validate: {
      validator: (email) => validator.isEmail(email),
      message:
        'Введенный email некорректный, введите корректный email',
    },
  },
  password: {
    type: String, // строка
    required: [true, 'Поле "password" должно быть заполнено обязательно'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
    select: false, // необходимо добавить поле select чтобы API не возвращал хеш пароля
  },
});

module.exports = mongoose.model('user', userSchema);
