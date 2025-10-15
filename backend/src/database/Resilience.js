class DatabaseResilience {
  static async withRetry(operation, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
      }
    }
  }

  static async withTimeout(operation, timeoutMs = 10000) {
    return Promise.race([
      operation(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), timeoutMs)
      )
    ]);
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default DatabaseResilience;
