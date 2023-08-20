const router = require("express").Router(); // создали роутер
const routerUsers = require("./users");
const routerCards = require("./cards");
const { NOT_FOUND_PAGE_STATUS_CODE } = require("../utils/errors");

router.use("/users", routerUsers); // запускаем
router.use("/cards", routerCards); // запускаем
router.use("/*", (req, res) => {
  res
    .status(NOT_FOUND_PAGE_STATUS_CODE)
    .send({ message: `${NOT_FOUND_PAGE_STATUS_CODE}: Страница не найдена.` });
});

module.exports = router;
