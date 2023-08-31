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
  let { statusCode } = err;
  const { message } = err;
  console.log(err);
  console.log(statusCode);
  console.log(message);
  if (!statusCode) { statusCode = 500; }
  res
    .status(statusCode)
    .send(
      // { message: 'Произошла ошибка на сервере' });
      { message: statusCode !== 500 ? message : 'Произошла ошибка на сервере' },
    );
});

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('БД подключена'))
  .catch(() => console.log('не удалось подключиться к БД'));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
