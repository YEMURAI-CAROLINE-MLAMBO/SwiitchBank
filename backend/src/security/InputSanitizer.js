import DefaultSecurityConfig from "../config/SecurityConfig.js";

export class InputSanitizer {
  static sanitizeInput(input, options = {}, securityConfig = DefaultSecurityConfig) {
    if (!securityConfig.validation) return input;
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
    } else if (typeof input === 'object' && input !== null) {
      return this.sanitizeObject(input, options, depth, maxDepth, securityConfig);
    }
    return input;
  }

  static sanitizeString(str, options, securityConfig = DefaultSecurityConfig) {
    let sanitized = str;
    sanitized = sanitized.replace(/\0/g, '');
    sanitized = sanitized.trim().replace(/\s+/g, ' ');
    sanitized = sanitized.replace(/[<>]/g, '');
    const maxLength = options.maxLength || securityConfig.validation.maxStringLength;
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }
    return sanitized;
  }

  static sanitizeObject(obj, options, depth, maxDepth, securityConfig) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanKey = this.sanitizeString(key, { maxLength: 100 }, securityConfig);
      sanitized[cleanKey] = this._sanitizeRecursive(value, options, depth + 1, maxDepth, securityConfig);
    }
    return sanitized;
  }
}