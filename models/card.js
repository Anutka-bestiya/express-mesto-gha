const mongoose = require("mongoose");
const User = require("./user");

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    required: true,
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true, //ссылка на модель автора карточки, тип ObjectId, обязательное поле;
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [], //список лайкнувших пост пользователей, массив ObjectId, по умолчанию — пустой массив (поле default);
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, //дата создания, тип Date, значение по умолчанию Date.now
  },
});

module.exports = mongoose.model("card", cardSchema);
