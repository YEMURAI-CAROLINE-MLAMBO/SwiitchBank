import { getAIResponse } from '../aiService.js';

// We need a handle to the mock function, so we define it in the outer scope.
const mockGenerateContent = jest.fn();

// The mock factory is hoisted and uses the mock function.
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: mockGenerateContent,
    })),
  })),
}));

describe('AI Service', () => {
  beforeEach(() => {
    // Clear mock history before each test.
    mockGenerateContent.mockClear();
  });

  it('should get a response from the AI service', async () => {
    // Arrange
    const mockResponseText = 'This is a test response.';
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockResponseText,
      },
    });
    const prompt = 'What is the meaning of life?';

    // Act
    const response = await getAIResponse(prompt);

    // Assert
    expect(response).toBe(mockResponseText);
    expect(mockGenerateContent).toHaveBeenCalledWith(prompt);
  });

  it('should handle AI service errors gracefully', async () => {
    // Arrange
    const errorMessage = 'API Error';
    mockGenerateContent.mockRejectedValue(new Error(errorMessage));
    const prompt = 'This will fail.';

    // Act & Assert
    await expect(getAIResponse(prompt)).rejects.toThrow(errorMessage);
  });
});
