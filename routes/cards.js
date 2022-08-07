const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки
router.post('/', createCard); // создает карточку
router.delete('/:cardId', deleteCard); // запрос удаляет карточку
router.put('/:cardId/likes', likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = router;
