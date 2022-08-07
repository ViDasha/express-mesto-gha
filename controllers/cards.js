const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  const ownerId = req.user._id; // _id станет доступен

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId) // удаление карточки по Id
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (req.user._id !== card.owner.toString()) { // нет прав удалять крточку другого пользователя
        res.status(404).send({ message: 'Вы не можете удалить эту карточку' });
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
