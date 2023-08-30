const router = require('express').Router(); // создали роутер
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerCards = require('./cards');
const routerUnauth = require('./unauth');
const routerAuth = require('./auth');
const { NOT_FOUND_PAGE_STATUS_CODE } = require('../utils/errors');

router.use('/users', auth, routerUsers);
router.use('/signup', routerUnauth);
router.use('/signin', routerAuth);
router.use('/cards', auth, routerCards);
router.use('/*', (req, res) => {
  res
    .status(NOT_FOUND_PAGE_STATUS_CODE)
    .send({ message: `${NOT_FOUND_PAGE_STATUS_CODE}: Страница не найдена.` });
});

module.exports = router;
