const mongoose = require("mongoose");
// const validator = require('validator'); // библиотека для проверки и валидации данных в Node.js.

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: {
    type: String, // строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  avatar: {
    required: true, // обязательное поле
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
