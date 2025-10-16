import SecurityConfig from "../config/SecurityConfig.js";

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class InputSanitizer {
  /**
   * COMPREHENSIVE INPUT CLEANING
   */
  static sanitizeInput(input, options = {}) {
    if (!SecurityConfig.validation) return input;
    const maxDepth = options.maxDepth || SecurityConfig.validation.maxObjectDepth;
    return this._sanitizeRecursive(input, options, 0, maxDepth);
  }

  static _sanitizeRecursive(input, options, depth, maxDepth) {
    if (depth > maxDepth) {
        return '[Sanitized: Max depth exceeded]';
    }

    if (typeof input === 'string') {
      return this.sanitizeString(input, options);
    } else if (Array.isArray(input)) {
      return input.map(item => this._sanitizeRecursive(item, options, depth + 1, maxDepth));
    } else if (typeof input === 'object' && input !== null) {
      return this.sanitizeObject(input, options, depth, maxDepth);
    }
    return input;
  }

  static sanitizeString(str, options) {
    let sanitized = str;

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Normalize whitespace
    sanitized = sanitized.trim().replace(/\s+/g, ' ');

    // Basic protection against HTML-like tags. A more robust solution like DOMPurify is recommended for production.
    sanitized = sanitized.replace(/[<>]/g, '');

    // Limit length if specified
    const maxLength = options.maxLength || SecurityConfig.validation.maxStringLength;
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  static sanitizeObject(obj, options, depth, maxDepth) {
    const sanitized = {};

    for (const [key, value] of Object.entries(obj)) {
      // Sanitize key
      const cleanKey = this.sanitizeString(key, { maxLength: 100 });

      // Sanitize value
      sanitized[cleanKey] = this._sanitizeRecursive(value, options, depth + 1, maxDepth);
    }

    return sanitized;
  }

  /**
   * TYPE-SPECIFIC VALIDATION
   */
  static validateEmail(email) {
    if (typeof email !== 'string') throw new ValidationError('Invalid email format');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Placeholder for disposable email check
    if (this.isDisposableEmail(email)) {
      throw new ValidationError('Disposable email addresses are not allowed');
    }

    return email.toLowerCase().trim();
  }

  static validatePhone(phone) {
    if (typeof phone !== 'string') throw new ValidationError('Invalid phone number format');
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length < 10 || cleaned.length > 15) {
      throw new ValidationError('Invalid phone number format');
    }

    return cleaned;
  }

  static validateCurrencyAmount(amount, currency) {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || !isFinite(numericAmount)) {
      throw new ValidationError('Invalid amount');
    }

    const maxAmount = this.getCurrencyMax(currency);
    if (Math.abs(numericAmount) > maxAmount) {
      throw new ValidationError(`Amount exceeds maximum allowed for ${currency}`);
    }

    const decimalPlaces = (numericAmount.toString().split('.')[1] || '').length;
    const allowedDecimals = this.getCurrencyDecimals(currency);

    if (decimalPlaces > allowedDecimals) {
      throw new ValidationError(`Too many decimal places for ${currency}`);
    }

    return numericAmount;
  }

  // --- Placeholder Methods ---
  static isDisposableEmail(email) {
      const disposableDomains = ['mailinator.com', 'temp-mail.org'];
      const domain = email.split('@')[1];
      return disposableDomains.includes(domain);
  }

  static getCurrencyMax(currency) {
      return SecurityConfig.validation.maxTransactionAmount;
  }

  static getCurrencyDecimals(currency) {
      const crypto = ['BTC', 'ETH'];
      return crypto.includes(currency) ? 8 : 2;
  }
}