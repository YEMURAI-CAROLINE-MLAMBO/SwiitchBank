import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import DefaultSecurityConfig from '../config/SecurityConfig.js';

// We need a JSDOM window to run DOMPurify on the server-side
const window = new JSDOM('').window;
const purify = DOMPurify(window);

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
      // Prevent infinite recursion on deeply nested or circular objects
      return '[Sanitized: Max depth exceeded]';
    }

    if (typeof input === 'string') {
      return this.sanitizeString(input, options, securityConfig);
    } else if (Array.isArray(input)) {
      return input.map(item => this._sanitizeRecursive(item, options, depth + 1, maxDepth, securityConfig));
    } else if (typeof input === 'object' && input !== null && !(input instanceof Date)) {
      return this.sanitizeObject(input, options, depth, maxDepth, securityConfig);
    }

    // Return numbers, booleans, dates, etc., as is
    return input;
  }

  /**
   * Sanitizes a string to prevent XSS, injection attacks, and other threats.
   */
  static sanitizeString(str, options = {}, securityConfig = DefaultSecurityConfig) {
    let sanitized = str;

    // 1. Trim whitespace
    sanitized = sanitized.trim();

    // 2. Use DOMPurify to prevent XSS. This is the most critical step.
    // It removes malicious HTML and scripts.
    sanitized = purify.sanitize(sanitized, {
      USE_PROFILES: { html: false, svg: false, mathMl: false }, // Disallow all HTML
    });

    // 3. Prevent NoSQL Injection by removing potentially harmful characters
    // This is a basic layer of defense. Parameterized queries are the primary defense.
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
      // Sanitize the key to prevent pollution attacks
      const sanitizedKey = this.sanitizeString(key, { maxLength: 100 }, securityConfig);

      // Sanitize the value
      const sanitizedValue = this._sanitizeRecursive(obj[key], options, depth + 1, maxDepth, securityConfig);

      sanitizedObj[sanitizedKey] = sanitizedValue;
    }
    return sanitizedObj;
  }
}