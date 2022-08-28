const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^(https?:\/\/)(www\.)?[a-z\d\D]*/),
  }),
}), createCard); // создает карточку

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), deleteCard); // запрос удаляет карточку

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), likeCard); // поставить лайк карточке

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), dislikeCard); // убрать лайк с карточки

module.exports = router;
