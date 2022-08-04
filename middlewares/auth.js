const jwt = require('jsonwebtoken');
const NotAuthorizationError = require('../errors/NotAuthorizationError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuthorizationError('Необходима авторизация.'));

    return
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new NotAuthorizationError('Необходима авторизация.'));

    return
  }

  req.user = payload;

  next();
};
