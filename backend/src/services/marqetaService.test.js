process.env.MARQETA_API_KEY = 'test-api-key';
const marqetaService = require('./marqetaService');
const axios = require('axios');

jest.mock('axios', () => {
  const mockAxios = {
    post: jest.fn(),
    put: jest.fn(),
    create: jest.fn(function () {
      return this;
    }),
  };
  return mockAxios;
});

describe('marqetaService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCard', () => {
    it('should create a new virtual card', async () => {
      const cardDetails = {
        userToken: 'test-user-token',
        cardProductToken: 'test-card-product-token',
      };
      const mockResponse = { id: 'test-card-id' };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await marqetaService.createCard(cardDetails);

      expect(axios.post).toHaveBeenCalledWith('/cards', cardDetails);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the Marqeta API call fails', async () => {
      const cardDetails = {
        userToken: 'test-user-token',
        cardProductToken: 'test-card-product-token',
      };
      const errorMessage = 'Failed to create virtual card';
      axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(marqetaService.createCard(cardDetails)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe('activateCard', () => {
    it('should activate a virtual card', async () => {
      const cardToken = 'test-card-token';
      const mockResponse = { status: 'ACTIVE' };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await marqetaService.activateCard(cardToken);

      expect(axios.post).toHaveBeenCalledWith(
        `/cards/${cardToken}/activation`
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the Marqeta API call fails', async () => {
      const cardToken = 'test-card-token';
      const errorMessage = 'Failed to activate virtual card';
      axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(marqetaService.activateCard(cardToken)).rejects.toThrow(
        errorMessage
      );
    });
  });
});
