import { InputSanitizer } from '../security/InputSanitizer.js';
import { DataConfiscation } from '../security/DataConfiscation.js';
import { FinancialValidation } from '../security/FinancialValidation.js';
import SecurityConfig from '../config/SecurityConfig.js';

export const securityMiddleware = (req, res, next) => {
  if (!SecurityConfig.dataConfiscation.enabled) {
    return next();
  }

  // Step 1: Sanitize all incoming data
  req.body = InputSanitizer.sanitizeInput(req.body);
  req.query = InputSanitizer.sanitizeInput(req.query);
  req.params = InputSanitizer.sanitizeInput(req.params);

  // Step 2: Analyze for threats
  const threatContext = {
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    route: req.path,
    method: req.method
  };

  DataConfiscation.confiscateWickedData(req.body, threatContext)
    .then((result) => {
      // Replace request body with cleansed data
      req.body = result.cleansedData;
      req.securityScan = result;

      next();
    })
    .catch((error) => {
      // Block request if malicious data detected
      console.error('Security Violation:', error.message);
      res.status(400).json({
        error: 'Security violation detected',
        message: error.message,
        requestId: req.id // Assuming a request ID is available on the req object
      });
    });
};

// Financial transaction specific middleware
export const transactionSecurity = async (req, res, next) => {
  const validation = await FinancialValidation.validateTransaction(req.body, req.user?.id);

  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Transaction validation failed',
      violations: validation.violations,
      riskScore: validation.riskScore
    });
  }

  const isCrypto = (currency) => ['BTC', 'ETH'].includes(currency);

  // Additional crypto validation for crypto transactions
  if (req.body.currency && isCrypto(req.body.currency)) {
    const cryptoValidation = FinancialValidation.validateCryptoTransaction(req.body);

    if (cryptoValidation.shouldBlock) {
      return res.status(400).json({
        error: 'Crypto transaction blocked for security',
        risks: cryptoValidation.risks
      });
    }
  }

  next();
};