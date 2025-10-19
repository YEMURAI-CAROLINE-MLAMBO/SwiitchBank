import express from 'express';
import DecisionEngine from '../framework/DecisionEngine.js';

const router = express.Router();

// Mock data for the implementation queue
const implementationQueue = [
  { id: 'task-001', title: 'Implement Multi-Currency Support', type: 'prototype' },
  { id: 'task-002', title: 'Build Fiat-Crypto Bridge', type: 'prototype' },
];

// Mock data for active decisions
const activeDecisions = [
  { id: 'dec-001', question: 'Should we use Stripe or Braintree for payment processing?', context: 'This decision impacts our transaction fees and international availability.', dataPoints: ['fee_structure', 'global_coverage'], optionA: 'Use Stripe', optionB: 'Use Braintree', timeLimit: '1 hour' },
];

/**
 * @swagger
 * /api/framework/queue:
 *   get:
 *     summary: Get the current implementation queue and active decisions
 *     responses:
 *       200:
 *         description: A list of tasks and decisions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 implementationQueue:
 *                   type: array
 *                 activeDecisions:
 *                   type: array
 */
router.get('/queue', (req, res) => {
  res.json({
    implementationQueue,
    activeDecisions
  });
});

/**
 * @swagger
 * /api/framework/decide:
 *   post:
 *     summary: Make a binary decision using the Decision Engine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               criteria:
 *                 type: object
 *     responses:
 *       200:
 *         description: The result of the decision.
 */
router.post('/decide', (req, res) => {
  const { question, criteria } = req.body;
  if (!question || !criteria) {
    return res.status(400).json({ error: 'Question and criteria are required.' });
  }

  const decisionResult = DecisionEngine.makeBinaryDecision(question, criteria);
  res.json(decisionResult);
});

export default router;
