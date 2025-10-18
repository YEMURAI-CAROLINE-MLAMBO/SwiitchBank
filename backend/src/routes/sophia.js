import express from 'express';
import { handleChat, getGeneratedInsights, askQuestion } from '../controllers/sophiaController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Route for the interactive chat feature
router.post('/chat', auth, handleChat);

// Route for getting pre-generated AI insights for the dashboard
router.get('/generated-insights', auth, getGeneratedInsights);

// Route for the "Ask Sophia" feature
router.post('/ask', auth, askQuestion);

export default router;