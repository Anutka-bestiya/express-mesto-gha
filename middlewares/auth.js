const jwt = require('jsonwebtoken');
const { HTTP_UNAUTHORIZED_STATUS_CODE } = require('../utils/errors');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(HTTP_UNAUTHORIZED_STATUS_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(HTTP_UNAUTHORIZED_STATUS_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
