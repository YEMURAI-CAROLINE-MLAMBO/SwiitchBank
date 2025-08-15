const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
// const { auth } = require('../middleware/auth');

// router.use(auth);

router.post('/issue', cardController.issueCard);
router.get('/', cardController.getCards);
router.get('/:id', cardController.getCardDetails);
router.put('/:id/status', cardController.updateCardStatus);

module.exports = router;
