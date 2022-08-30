const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const handleErrors = require('../errors/handle-errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => handleErrors(err, res, next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  const ownerId = req.user._id; // _id станет доступен

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send(card))
    .catch((err) => handleErrors(err, res, next));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId) // удаление карточки по Id
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }

      if (req.user._id !== card.owner.toString()) {
        return next(new ForbiddenError('Вы не можете удалить эту карточку'));
      }

      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => handleErrors(err, res, next));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => handleErrors(err, res, next));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => handleErrors(err, res, next));
};
