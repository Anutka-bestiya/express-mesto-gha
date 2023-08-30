/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
// const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const routes = require('./routes/router');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json()); // Парсинг JSON-запросов
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

// app.use(express.static(path.join(__dirname, "public")));

// Подключение маршрутов приложения
app.use(routes); // запускаем роутинг

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'Произошла ошибка на сервере'
        : message,
    });
});

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('БД подключена'))
  .catch(() => console.log('не удалось подключиться к БД'));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
