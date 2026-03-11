const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/users', protect, getAllUsers);

module.exports = router;
