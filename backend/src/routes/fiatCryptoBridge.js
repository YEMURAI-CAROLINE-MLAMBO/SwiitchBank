const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fiatCryptoBridgeController = require('../controllers/fiatCryptoBridgeController');

router.use(auth);

router.get('/rates', fiatCryptoBridgeController.getRates);
router.post('/trade', fiatCryptoBridgeController.performTrade);

module.exports = router;
