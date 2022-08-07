const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/:userId', getUserById);
router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateProfile); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router; // экспортировали роутер
