import { GoogleGenerativeAI } from "@google/generative-ai";
import CacheService from './CacheService.js';
import crypto from 'crypto';

class HighCapacitySophiaService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.requestQueue = [];
    this.processing = false;
    this.maxBatchSize = 10;
  }

  async analyzeFinancialData(transactions) {
    const prompt = `Analyze the following transactions and provide a summary of spending habits: ${JSON.stringify(transactions)}`;
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  _processInBackground(jobId, transactions) {
    console.log(`Processing job ${jobId} in the background.`);
    this.analyzeFinancialData(transactions).then(result => {
      console.log(`Job ${jobId} complete. Result: ${result}`);
    }).catch(error => {
      console.error(`Error processing job ${jobId}:`, error);
    });
  }

  _createAnalysisPrompt(transactions) {
    return `Analyze the following transactions and provide a detailed financial analysis: ${JSON.stringify(transactions)}`;
  }

  _combineAnalyses(analyses) {
    return analyses.join('\n\n');
  }

  /**
   * BATCH PROCESSING for multiple users
   */
  async batchAnalyzeTransactions(usersTransactions) {
    const batches = this._createBatches(usersTransactions, this.maxBatchSize);
    const results = [];

    for (const batch of batches) {
      const batchResults = await Promise.allSettled(
        batch.map(async ({ userId, transactions }) => {
          const cacheKey = `sophia:analysis:${userId}:${this._generateHash(transactions)}`;

          // Check cache first
          const cached = await CacheService.get(cacheKey);
          if (cached) return { userId, analysis: cached, cached: true };

          // Process with rate limiting
          const analysis = await this._processWithRateLimit(transactions);
          await CacheService.set(cacheKey, analysis, 3600); // Cache for 1 hour

          return { userId, analysis, cached: false };
        })
      );

      results.push(...batchResults);
      await this._delay(100); // Small delay between batches
    }

    return results;
  }

  /**
   * STREAMING RESPONSES for large data
   */
  async streamFinancialAnalysis(transactions, callback) {
    const prompt = this._createAnalysisPrompt(transactions);

    // For very large datasets, use streaming
    const result = await this.model.generateContentStream(prompt);

    let fullResponse = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      callback(chunkText); // Send chunks as they come
    }

    return fullResponse;
  }

  /**
   * ASYNC PROCESSING for long-running tasks
   */
  async asyncDeepAnalysis(userId, transactions) {
    // Immediate response with job ID
    const jobId = `analysis_${userId}_${Date.now()}`;

    // Process in background
    this._processInBackground(jobId, transactions);

    return {
      jobId,
      status: 'processing',
      message: 'Deep analysis started, check back later for results',
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };
  }

  /**
   * MEMORY-EFFICIENT LARGE DATA PROCESSING
   */
  async processLargeTransactionHistory(transactions, chunkSize = 1000) {
    const chunks = [];

    for (let i = 0; i < transactions.length; i += chunkSize) {
      const chunk = transactions.slice(i, i + chunkSize);
      chunks.push(chunk);
    }

    const analyses = [];
    for (const chunk of chunks) {
      // Process each chunk independently to manage memory
      const analysis = await this.analyzeFinancialData(chunk);
      analyses.push(analysis);

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
    }

    // Combine results
    return this._combineAnalyses(analyses);
  }

  // Private helper methods
  _createBatches(array, size) {
    const batches = [];
    for (let i = 0; i < array.length; i += size) {
      batches.push(array.slice(i, i + size));
    }
    return batches;
  }

  async _processWithRateLimit(transactions) {
    // Implement token bucket or leaky bucket algorithm
    await this._waitForToken();
    return this.analyzeFinancialData(transactions);
  }

  async _waitForToken() {
    // Simple rate limiting - 10 requests per second
    const now = Date.now();
    const lastRequest = this.lastRequest || 0;
    const timeSinceLast = now - lastRequest;

    if (timeSinceLast < 100) { // 10 requests per second = 100ms between requests
      await this._delay(100 - timeSinceLast);
    }

    this.lastRequest = Date.now();
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _generateHash(data) {
    // Simple hash for caching
    return crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
  }
}

export default HighCapacitySophiaService;
