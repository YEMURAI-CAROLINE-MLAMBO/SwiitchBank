import { securityMiddleware } from './SecurityMiddleware.js';
import { jest } from '@jest/globals';

describe('SecurityMiddleware', () => {
  it('should sanitize the request body, query, and params', () => {
    const mockSanitizer = {
      sanitizeInput: jest.fn(input => {
        const sanitizedInput = {};
        for (const key in input) {
          sanitizedInput[key] = `sanitized_${input[key]}`;
        }
        return sanitizedInput;
      }),
    };

    const req = {
      app: {
        get: jest.fn().mockReturnValue(mockSanitizer),
      },
      body: { name: '<John Doe>' },
      query: { search: '<img src=x onerror=alert(1)>' },
      params: { id: '123<bad>' }
    };
    const res = {};
    const next = jest.fn();

    securityMiddleware(req, res, next);

    expect(req.body).toEqual({ name: 'sanitized_<John Doe>' });
    expect(req.query).toEqual({ search: 'sanitized_<img src=x onerror=alert(1)>' });
    expect(req.params).toEqual({ id: 'sanitized_123<bad>' });
    expect(next).toHaveBeenCalled();
  });
});
