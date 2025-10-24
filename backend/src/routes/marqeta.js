import express from 'express';
import { processWebhookEvent } from '../services/marqetaWebhookService.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), processWebhookEvent);

export default router;
