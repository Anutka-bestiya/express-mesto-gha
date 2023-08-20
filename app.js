const express = require("express");
const mongoose = require("mongoose");
//const path = require("path");
const bodyParser = require("body-parser");
const routes = require("./routes/router");
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json()); // Парсинг JSON-запросов
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

//app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  req.user = {
    _id: "64e209cf5ba5d80f14c84bae",
  };

  next();
});

// Подключение маршрутов приложения
app.use(routes); // запускаем

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb")
  .then(() => console.log("БД подключена"))
  .catch(() => console.log("не удалось подключиться к БД"));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
