const mongoose = require('mongoose');
const validator = require('validator'); // библиотека для проверки и валидации данных в Node.js.

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: [true, 'Поле "name" должно быть заполнено обязательно'], // обязательное поле
    minlength: [2, 'Минимальное количество символов для поля "name" - 2'], // минимальная длина имени — 2 символа
    maxlength: [
      30,
      'Максимальное количество символов для поля "name" - 30',
    ], // а максимальная — 30 символов
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message:
        'Введенный URL адрес некорректный, введите корректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true, // ссылка на модель автора карточки, тип ObjectId, обязательное поле;
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [], // список лайкнувших пользователей, массив ObjectId, по умолчанию — пустой массив
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // дата создания, тип Date, значение по умолчанию Date.now
  },
});

module.exports = mongoose.model('card', cardSchema);
