const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/:userId', getUserById);
router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', updateProfile); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router; // экспортировали роутер
