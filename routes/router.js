const router = require('express').Router(); // создали роутер
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerCards = require('./cards');
const routerAuth = require('./auth');
const routerReg = require('./reg');
const NotFoundError = require('../errors/not-found-err');

router.use('/signup', routerReg);
router.use('/signin', routerAuth);
router.use('/users', auth, routerUsers);
router.use('/cards', auth, routerCards);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
