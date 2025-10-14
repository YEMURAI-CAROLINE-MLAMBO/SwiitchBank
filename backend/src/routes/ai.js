import express from 'express';
const router = express.Router();
import * as aiController from '../controllers/aiController.js';

router.post('/ask', aiController.getAIAssistantResponse);

export default router;
