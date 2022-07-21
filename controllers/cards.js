const Card = require("../models/card");

// Создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  //Card.create({ name, link, owner }).then((card) => res.send(card));

  Card.create({ name, link, owner })

    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(500).send({ message: `Возникла ошибка ${err.message}` })
    );
};

// Возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(500).send({ message: `Возникла ошибка ${err.message}` })
    );
};

// Удаляет карточку по _id
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId).then((card) => {
    return Card.deleteOne(card).then(() => res.send({ message: "" }));
  });
};

// Ставит лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    // .then((card) => {
    //   res.send(card);
    // });

    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(500).send({ message: `Возникла ошибка ${err.message}` })
    );
};

// Убирает лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    //.then((card) => {
    //  res.send(card);
    //});
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(500).send({ message: `Возникла ошибка ${err.message}` })
    );
};
