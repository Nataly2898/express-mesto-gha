const Card = require('../models/card');
const { NotFoundError } = require('../Error/NotFoundError');
const { NotValidError } = require('../Error/NotValidError');
const { CastError } = require('../Error/CastError');
const { ForbiddenError } = require('../Error/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.postCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(200).send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new NotValidError('Некорректные данные'));
    } else {
      next(error);
    }
  }
};

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

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastError('Некорректые данные карточки'));
      } else {
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastError('Некорректые данные карточки'));
      } else {
        next(error);
      }
    });
};