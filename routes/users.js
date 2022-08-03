const router = require('express').Router();

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
