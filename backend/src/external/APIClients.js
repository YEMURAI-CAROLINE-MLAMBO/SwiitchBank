import CircuitBreaker from '../security/CircuitBreaker.js';

class ProtectedAPIClient {
  constructor(baseClient) {
    this.client = baseClient;
    // The service to be protected is the 'call' method of the base client
    this.circuitBreaker = new CircuitBreaker(this.client.call.bind(this.client));
  }

  async callWithProtection(request) {
    return await this.circuitBreaker.call(request);
  }
}

export default ProtectedAPIClient;
