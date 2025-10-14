import express from 'express';
import { handleChat } from '../controllers/sophiaController.js';
// import auth from '../middleware/auth.js'; // Assuming auth middleware exists

const router = express.Router();

// 🚀 NEW: One Unified Sophia Endpoint
// ❌ REMOVED: /api/jools/chat
// ✅ KEPT: /api/sophia/chat
router.post('/chat', /* auth, */ handleChat);

export default router;
