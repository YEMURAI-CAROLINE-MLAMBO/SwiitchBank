import SecurityConfig from "../config/SecurityConfig.js";
import { UserTransactionHistoryService } from "../services/UserTransactionHistoryService.js";

export class FinancialValidation {
  /**
   * VALIDATE FINANCIAL TRANSACTIONS
   */
  static async validateTransaction(transaction, userId) {
    const violations = [];

    if (!this.isValidAmount(transaction.amount)) {
      violations.push({
        field: 'amount',
        issue: 'Invalid transaction amount',
        severity: 'HIGH'
      });
    }

    if (!this.isValidCurrency(transaction.currency)) {
      violations.push({
        field: 'currency',
        issue: 'Invalid or unsupported currency',
        severity: 'MEDIUM'
      });
    }

    if (!this.isValidAccount(transaction.account)) {
      violations.push({
        field: 'account',
        issue: 'Suspicious account pattern',
        severity: 'HIGH'
      });
    }

    if (await this.isSuspiciousTiming(transaction, userId)) {
      violations.push({
        field: 'timestamp',
        issue: 'Suspicious transaction timing (rapid transactions)',
        severity: 'MEDIUM'
      });
    }

    return {
      isValid: violations.length === 0,
      violations,
      riskScore: this.calculateRiskScore(violations)
    };
  }

  /**
   * CRYPTO TRANSACTION SECURITY
   */
  static validateCryptoTransaction(tx) {
    const risks = [];

    if (!this.isValidCryptoAddress(tx.toAddress, tx.currency)) {
      risks.push({
        type: 'INVALID_WALLET',
        severity: 'CRITICAL',
        message: 'Invalid or malicious wallet address'
      });
    }

    // Placeholder for checking against known scam addresses
    if (this.isKnownScamAddress(tx.toAddress)) {
      risks.push({
        type: 'KNOWN_SCAM',
        severity: 'CRITICAL',
        message: 'Recipient address is associated with known scams'
      });
    }

    if (this.isSuspiciousCryptoAmount(tx.amount)) {
      risks.push({
        type: 'SUSPICIOUS_AMOUNT',
        severity: 'HIGH',
        message: 'Unusually large or small crypto transaction'
      });
    }

    return {
      isValid: risks.length === 0,
      risks,
      shouldBlock: risks.some(r => r.severity === 'CRITICAL')
    };
  }

  // --- Helper and Placeholder Methods ---
  static isValidAmount(amount) {
    if (!SecurityConfig.validation) return false;
    return typeof amount === 'number' && isFinite(amount) && Math.abs(amount) < SecurityConfig.validation.maxTransactionAmount;
  }

  static isValidCurrency(currency) {
    if (!SecurityConfig.validation) return false;
    return typeof currency === 'string' && SecurityConfig.validation.allowedCurrencies.includes(currency);
  }

  static isValidAccount(account) {
    // Placeholder - in a real system, this would check against known bad account patterns
    return account !== '000-000-000';
  }

  static async isSuspiciousTiming(transaction, userId) {
    // Check for rapid transactions from the same user
    const recentTransactions = await UserTransactionHistoryService.getRecentTransactions(userId, 5); // Check last 5 minutes
    // If there are more than 3 transactions in the last 5 minutes, flag as suspicious.
    return recentTransactions.length > 3;
  }

  static calculateRiskScore(violations) {
      const severityMap = { HIGH: 0.4, MEDIUM: 0.2, LOW: 0.1 };
      return violations.reduce((score, v) => score + (severityMap[v.severity] || 0), 0);
  }

  static isValidCryptoAddress(address, currency) {
      if (typeof address !== 'string') return false;
      if (currency === 'BTC') return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
      if (currency === 'ETH') return /^0x[a-fA-F0-9]{40}$/.test(address);
      return false; // Not a supported crypto
  }

  static isKnownScamAddress(address) {
      // Placeholder for a real-time check against a threat intelligence database
      return false;
  }

  static isSuspiciousCryptoAmount(amount) {
      // Placeholder for anomaly detection based on currency type
      return amount > 100000; // e.g. > $100k USD equivalent
  }
}