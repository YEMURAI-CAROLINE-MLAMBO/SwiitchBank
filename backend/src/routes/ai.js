const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const apiLimiter = require('../middleware/rateLimiter');
const { body } = require('express-validator');

router.post(
  '/ask',
  apiLimiter,
  [body('prompt').notEmpty().withMessage('Prompt is required')],
  aiController.getAIAssistantResponse
);

module.exports = router;
