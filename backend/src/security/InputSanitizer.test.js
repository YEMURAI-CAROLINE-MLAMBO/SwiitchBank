import { InputSanitizer } from './InputSanitizer.js';

const testConfig = {
    validation: {
        maxStringLength: 1000,
        maxObjectDepth: 10,
    },
};

describe('InputSanitizer', () => {
  describe('sanitizeString', () => {
    it('should remove null bytes', () => {
      expect(InputSanitizer.sanitizeString('hello\0world', {}, testConfig)).toBe('helloworld');
    });

    it('should trim whitespace', () => {
      expect(InputSanitizer.sanitizeString('  hello world  ', {}, testConfig)).toBe('hello world');
    });

    it('should remove < and > characters', () => {
      expect(InputSanitizer.sanitizeString('<script>alert("xss")</script>', {}, testConfig)).toBe('scriptalert("xss")/script');
    });

    it('should truncate strings that are too long', () => {
        const customConfig = { validation: { maxStringLength: 5 } };
        expect(InputSanitizer.sanitizeString('hello world', {}, customConfig)).toBe('hello');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string values in an object', () => {
      const dirty = {
        name: '  <John Doe>  ',
        comment: 'this is a <script> tag'
      };
      const clean = {
        name: 'John Doe',
        comment: 'this is a script tag'
      };
      expect(InputSanitizer.sanitizeInput(dirty, {}, testConfig)).toEqual(clean);
    });

    it('should handle nested objects', () => {
        const dirty = {
            user: {
                firstName: '  <John>  ',
                lastName: '<Doe>'
            }
        };
        const clean = {
            user: {
                firstName: 'John',
                lastName: 'Doe'
            }
        };
        expect(InputSanitizer.sanitizeInput(dirty, {}, testConfig)).toEqual(clean);
    });
  });
});