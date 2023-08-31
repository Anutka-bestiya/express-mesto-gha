const router = require('express').Router(); // создали роутер
// const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerCards = require('./cards');
const routerAuth = require('./auth');
const { NOT_FOUND_PAGE_STATUS_CODE } = require('../utils/status_code');

router.use('/users', auth, routerUsers);
router.use('/', routerAuth);
router.use('/cards', auth, routerCards);
router.use('*', (req, res) => {
  res
    .status(NOT_FOUND_PAGE_STATUS_CODE)
    .send({ message: `${NOT_FOUND_PAGE_STATUS_CODE}: Страница не найдена.` });
});

module.exports = router;
