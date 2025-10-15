import FraudDetection from '../security/FraudDetection.js';
import AccountProtection from '../security/AccountProtection.js';
import FraudAlerts from '../security/FraudAlerts.js';

export const analyzeTransaction = async (req, res, next) => {
  const transaction = req.body;
  // TODO: Get user behavior from request or database
  const userBehavior = {};

  const risk = await FraudDetection.analyzeTransaction(transaction, userBehavior);

  if (risk.riskLevel === 'high' || risk.riskLevel === 'critical') {
    await FraudAlerts.triggerAlert({
      type: 'high_risk_transaction',
      severity: risk.riskLevel,
      userId: req.user.id,
      transactionId: risk.transactionId,
      description: 'Transaction flagged for review',
      riskScore: risk.riskScore
    });
    return res.status(400).json({ error: 'Transaction flagged for review' });
  }

  next();
};

export const protectLogin = async (req, res, next) => {
  const loginAttempt = req.body;
  // TODO: Get user history from database
  const userHistory = {};

  const protection = AccountProtection.detectLoginAnomalies(loginAttempt, userHistory);

  if (protection.hasAnomalies && protection.overallRisk > 0.7) {
     return res.status(401).json({ error: 'Login attempt blocked due to high risk' });
  }

  if (protection.action === 'require_mfa') {
    return res.status(401).json({ requiresMFA: true });
  }

  next();
};
