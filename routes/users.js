const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().required().length(24),
  }),
}), getUserById);

router.get('/', getUsers);

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile); // обновляет профиль

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)(www\.)?[a-z\d\D]*/),
  }),
}), updateAvatar); // обновляет аватар

module.exports = router; // экспортировали роутер
