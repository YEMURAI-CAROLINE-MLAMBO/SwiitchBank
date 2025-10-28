import { jest } from '@jest/globals';
import ModelContextProtocol from '../src/mcp/protocol.js';
import { CONTEXTS } from '../src/mcp/contexts.js';

describe('ModelContextProtocol', () => {
  let mockModel;
  let rules;
  let mcp;
  const mockUser = { id: '123' };

  beforeEach(() => {
    mockModel = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    };
    rules = {
      [CONTEXTS.USER_READ]: jest.fn((user, query) => mockModel.find({ user: user.id }).sort()),
      [CONTEXTS.ADMIN_READ]: jest.fn((user, query) => mockModel.find().sort()),
    };
    mcp = new ModelContextProtocol(rules);
  });

  it('should call the correct rule for USER_READ context', async () => {
    await mcp.apply(CONTEXTS.USER_READ, mockUser);
    expect(rules[CONTEXTS.USER_READ]).toHaveBeenCalledWith(mockUser, undefined);
    expect(mockModel.find).toHaveBeenCalledWith({ user: mockUser.id });
  });

  it('should call the correct rule for ADMIN_READ context', async () => {
    await mcp.apply(CONTEXTS.ADMIN_READ, mockUser);
    expect(rules[CONTEXTS.ADMIN_READ]).toHaveBeenCalledWith(mockUser, undefined);
    expect(mockModel.find).toHaveBeenCalledWith();
  });

  it('should throw an error for an invalid context', async () => {
    await expect(mcp.apply('INVALID_CONTEXT', mockUser)).rejects.toThrow('Invalid context: INVALID_CONTEXT');
  });
});
