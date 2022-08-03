const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError'); // ошибка 404
const { ForbiddenError } = require('../errors/ForbiddenError'); // ошибка 403


// Создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Введены некорректные данные  ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

// Возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Возникла ошибка ${err.message}` }));
};

// Удаляет карточку по _id
/* Старая версия
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        Card.deleteOne(card).then(() => {
          res.send({ message: 'Карточка успешно удалена' });
        });
      } else {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Введены некорректные данные  ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};
*/

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
      card.remove();
      res.status(200).send({ data: card, message: 'Карточка успешно удалена' });
    })
    .catch(next);
};

// Ставит лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Введены некорректные данные  ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

// Убирает лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Введены некорректные данные  ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};
