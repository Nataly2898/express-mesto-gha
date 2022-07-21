const User = require('../models/user');

// Возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Возникла ошибка ${err.message}` }));
};
/*
// Возвращает пользователя по _id
module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: err }));
};
*/

/* Возвращает пользователя по _id */
module.exports.getUserId = (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			if (!user) { res.status(404).send({ message: "Нет пользователя с таким id" }); } else res.send({ data: user });
		})
	/* Странно, что, если id короче 25, то ошибку обрабатывает catch. А если 25 символов, то then. */
		.catch((err, user) => {
			if (!user) { res.status(404).send({ message: "Нет пользователя с таким id" }); } else res.status(500).send({ message: `Возникла ошибка ${err.message}` });
		}); /* Добавлена обработка ошибки при запросе несуществующего пользователя */
};

// Создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(500).send({ message: `Возникла ошибка ${err.message}` }));
};

// Обновляет профиль
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
  .then((user) => res.status(201).send({ data: user }))
  .catch((err) => res.status(400).send({ message: err }));
};

// Обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(500).send({ message: `Возникла ошибка ${err.message}` }));
};