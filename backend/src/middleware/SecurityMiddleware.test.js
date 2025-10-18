import { securityMiddleware } from './SecurityMiddleware.js';
import { jest } from '@jest/globals';

describe('SecurityMiddleware', () => {
  it('should sanitize the request body, query, and params', () => {
    const mockSanitizer = {
      sanitizeInput: jest.fn(input => input),
    };

    const req = {
      app: {
        get: jest.fn().mockReturnValue(mockSanitizer),
      },
      body: { name: '  <John Doe>  ' },
      query: { search: '<img src=x onerror=alert(1)>' },
      params: { id: '123<bad>' }
    };
    const res = {};
    const next = jest.fn();

    securityMiddleware(req, res, next);

    expect(mockSanitizer.sanitizeInput).toHaveBeenCalledWith(req.body);
    expect(mockSanitizer.sanitizeInput).toHaveBeenCalledWith(req.query);
    expect(mockSanitizer.sanitizeInput).toHaveBeenCalledWith(req.params);
    expect(next).toHaveBeenCalled();
  });
});