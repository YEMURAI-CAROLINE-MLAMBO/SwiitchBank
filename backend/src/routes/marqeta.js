import express from 'express';
import { handleWebhookController } from '../controllers/marqetaController.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhookController);

export default router;
