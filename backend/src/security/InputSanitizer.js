import sanitizeHtml from 'sanitize-html';
import DefaultSecurityConfig from '../config/SecurityConfig.js';

export class InputSanitizer {
  /**
   * Sanitizes an input value (string, object, or array) recursively.
   * @param {*} input - The input to sanitize.
   * @param {object} [options={}] - Custom sanitization options.
   * @param {object} [securityConfig=DefaultSecurityConfig] - The security configuration.
   * @returns {*} The sanitized input.
   */
  static sanitizeInput(input, options = {}, securityConfig = DefaultSecurityConfig) {
    if (!input || !securityConfig.validation.enabled) {
      return input;
    }
    const maxDepth = options.maxDepth || securityConfig.validation.maxObjectDepth;
    return this._sanitizeRecursive(input, options, 0, maxDepth, securityConfig);
  }

  static _sanitizeRecursive(input, options, depth, maxDepth, securityConfig) {
    if (depth > maxDepth) {
      return '[Sanitized: Max depth exceeded]';
    }

    if (typeof input === 'string') {
      return this.sanitizeString(input, options, securityConfig);
    } else if (Array.isArray(input)) {
      return input.map(item => this._sanitizeRecursive(item, options, depth + 1, maxDepth, securityConfig));
    } else if (typeof input === 'object' && input !== null && !(input instanceof Date)) {
      return this.sanitizeObject(input, options, depth, maxDepth, securityConfig);
    }

    return input;
  }

  /**
   * Sanitizes a string to prevent XSS, injection attacks, and other threats.
   */
  static sanitizeString(str, options = {}, securityConfig = DefaultSecurityConfig) {
    let sanitized = str;

    // 1. Trim whitespace
    sanitized = sanitized.trim();

    // 2. Use sanitize-html to prevent XSS.
    sanitized = sanitizeHtml(sanitized, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // 3. Prevent NoSQL Injection
    if (securityConfig.validation.preventNoSQLInjection) {
      sanitized = sanitized.replace(/[$(){}[\]]/g, '');
    }

    // 4. Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ');

    // 5. Enforce max length
    const maxLength = options.maxLength || securityConfig.validation.maxStringLength;
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  /**
   * Sanitizes the keys and values of an object recursively.
   */
  static sanitizeObject(obj, options, depth, maxDepth, securityConfig) {
    const sanitizedObj = {};
    for (const key in obj) {
      const sanitizedKey = this.sanitizeString(key, { maxLength: 100 }, securityConfig);
      const sanitizedValue = this._sanitizeRecursive(obj[key], options, depth + 1, maxDepth, securityConfig);
      sanitizedObj[sanitizedKey] = sanitizedValue;
    }
    return sanitizedObj;
  }
}
