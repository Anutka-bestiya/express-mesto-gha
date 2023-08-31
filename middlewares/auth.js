const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // достаём токен
  const token = req.cookies.jwt;
  function checkToken(token) {
    if (!token) {
      throw new UnauthorizedError('Токен не получен из куки. Необходима авторизация');
    }

    try {
      return jwt.verify(token, 'dev-secret');
    } catch (err) {
      throw new UnauthorizedError('Токен не прошел верификацию. Необходима авторизация');
    }
  }
  const payload = checkToken(token);
  if (!payload) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
