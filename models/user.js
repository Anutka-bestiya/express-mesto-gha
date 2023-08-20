const mongoose = require('mongoose');
const validator = require('validator'); // библиотека для проверки и валидации данных в Node.js.

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: [true, 'Поле "name" должно быть заполнено обязательно'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: [2, 'Минимальное количество символов для поля "name" - 2'], // минимальная длина имени — 2 символа
    maxlength: [
      30,
      'Максимальное количество символов для поля "name" - 30'], // а максимальная — 30 символов
  },
  about: {
    type: String, // строка
    required: [true, 'Поле "about" должно быть заполнено обязательно'], // обязательное поле
    minlength: [2, 'Минимальное количество символов для поля "about" - 2'], // минимальная длина имени — 2 символа
    maxlength: [
      30,
      'Максимальное количество символов для поля "about" - 30'], // а максимальная — 30 символов
  },
  avatar: {
    required: [true, 'Поле "avatar" должно быть заполнено обязательно'], // обязательное поле
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message:
        'Введенный URL адрес некорректный, введите корректный URL',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
