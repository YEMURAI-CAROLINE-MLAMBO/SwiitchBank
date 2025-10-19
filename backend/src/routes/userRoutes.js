const express = require('express');
const {
  authUser,
  registerUser,
  logoutUser,
} = require('../controllers/userController.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

module.exports = router;
