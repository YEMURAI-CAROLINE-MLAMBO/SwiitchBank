import express from 'express';
const router = express.Router();
import { QuarantineDB } from '../database/QuarantineDB.js';

// Mock data for threats that would normally be logged
const mockThreats = [
    { id: 1, type: 'SQL Injection Attempt', level: 'High', timestamp: '2023-10-27T10:00:00Z', details: "Blocked query: ' OR 1=1; --" },
    { id: 2, type: 'XSS Attempt', level: 'Medium', timestamp: '2023-10-27T10:05:00Z', details: "Sanitized input: <script>alert('xss')</script>" },
    { id: 3, type: 'Financial Fraud Pattern', level: 'High', timestamp: '2023-10-27T10:12:00Z', details: "Detected fake card number in input." },
];

// GET /api/security/metrics
router.get('/metrics', async (req, res) => {
    // In a real app, this data would come from a monitoring service or database aggregation.
    const quarantinedItems = await QuarantineDB.find({});
    res.json({
        threatsBlocked: 142, // Dummy value
        dataQuarantined: quarantinedItems.length,
        cleanRate: 99.8, // Dummy value
    });
});

// GET /api/security/threats
router.get('/threats', (req, res) => {
    // This would fetch recent threat events from a log or database.
    res.json(mockThreats);
});

export default router;