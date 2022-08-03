const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError'); // ошибка 404
const NotAuthorizationError = require('../errors/NotAuthorizationError'); // ошибка 401
const IncorrectRequestError = require('../errors/IncorrectRequestError'); // ошибка 400
const ExistingEmailError = require('../errors/ExistingEmailError'); // ошибка 409

// Возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

/* Старая версия
module.exports.getUsers = (req, res, next) => {
//  User.find({})
//    .then((users) => res.status(200).send({ data: users }))
//    .catch((err) =>
//      res.status(500).send({ message: `Возникла ошибка ${err.message}` });
//    );
};
*/

// Возвращает пользователя по _id
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

/* Старая версия
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: `Введены некорректные данные  ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};
*/

// Создаём пользователя
module.exports.createUser = (req, res, next) => {
  // хешируем пароль
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка валидации ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

// Аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        "some-secret-key",
        {
          expiresIn: '7d',
        },
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

// Возвращаем информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    // проверяем, есть ли пользователь с таким id
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    // возвращаем пользователя, если он есть
    return res.status(200).send(user);
  }).catch(next);
};

// Обновляем профиль
module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: `Введены некорректные данные  ${err.message}` });
      } else if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: `Введены некорректные данные  ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

// Обновляем аватар
module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: `Введены некорректные данные  ${err.message}` });
      } else if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: `Введены некорректные данные  ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};
