// This is the core of the fix: use a factory function for the mock.
// Jest will hoist this call to the top of the module, so it runs before any imports.
jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn();
  const mockGetGenerativeModel = jest.fn(() => ({
    generateContent: mockGenerateContent,
  }));
  const mockGoogleGenerativeAI = jest.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  }));

  // The factory returns the mocked module.
  return {
    GoogleGenerativeAI: mockGoogleGenerativeAI,
    // Expose the mock functions to be used in tests
    mockGenerateContent,
    mockGetGenerativeModel,
    mockGoogleGenerativeAI,
  };
});

describe('AI Service', () => {
  let getAIResponse;
  let mockGenerateContent;
  let mockGetGenerativeModel;
  let mockGoogleGenerativeAI;

  beforeEach(async () => {
    // Reset modules to clear cache and ensure the mock is used for a fresh instance
    jest.resetModules();

    // Dynamically import the mocked module and the service inside beforeEach
    // to ensure a fresh instance for each test.
    const aiService = await import('../aiService.js');
    const mockGenAI = await import('@google/generative-ai');

    getAIResponse = aiService.getAIResponse;
    mockGenerateContent = mockGenAI.mockGenerateContent;
    mockGetGenerativeModel = mockGenAI.mockGetGenerativeModel;
    mockGoogleGenerativeAI = mockGenAI.mockGoogleGenerativeAI;
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
    expect(mockGoogleGenerativeAI).toHaveBeenCalledTimes(1);
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-pro' });
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
