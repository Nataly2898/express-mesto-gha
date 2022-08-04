const jwt = require('jsonwebtoken');

const NotAuthorizationError = require('../errors/NotAuthorizationError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new NotAuthorizationError('Необходима авторизация');
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new NotAuthorizationError('Необходима авторизация');
  }
  req.user = payload; // записываем пейлоад в объект запроса

  next();
};
