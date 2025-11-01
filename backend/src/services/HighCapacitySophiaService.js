import { GoogleGenerativeAI } from "@google/generative-ai";
import ProtectedAPIClient from '../external/APIClients.js';
import CacheService from './CacheService.js';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import AnalysisJob from '../models/AnalysisJob.js'; // A new model to store job results
import mailslurp from '../config/mailslurp.js';

class HighCapacitySophiaService {
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use a model that supports streaming
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    this.geminiClient = new ProtectedAPIClient({
      call: async (request) => {
        const result = await model.generateContent(request.prompt);
        return { data: result.response.text() };
      },
      // Add a streaming call method
      stream: async (request) => {
        return model.generateContentStream(request.prompt);
      }
    });

    this.rateLimiter = this._createRateLimiter(10, 1000); // 10 requests per second
  }

  /**
   * Generates a sophisticated prompt for deep financial analysis.
   */
  _createAnalysisPrompt(transactions, outputFormat = 'json') {
    return `
      You are Sophia, an advanced financial AI. Perform a deep analysis of the following financial transactions.

      Your analysis must include:
      1.  **Executive Summary**: A brief, high-level overview of the financial health and key trends.
      2.  **Spending Breakdown**: A detailed breakdown of spending by category, including percentages.
      3.  **Income Analysis**: An overview of income sources and stability.
      4.  **Cash Flow**: A summary of monthly cash flow (income vs. expenses).
      5.  **Actionable Insights**: 3-5 specific, actionable recommendations for financial improvement (e.g., budget adjustments, savings opportunities, potential fraudulent activity).

      Present the output in a valid ${outputFormat} format. For JSON, use the keys: "summary", "spendingBreakdown", "incomeAnalysis", "cashFlow", "insights".

      Transactions: ${JSON.stringify(transactions)}
    `;
  }

  /**
   * Analyzes financial data and returns a structured JSON object.
   */
  async analyzeFinancialData(transactions) {
    const prompt = this._createAnalysisPrompt(transactions, 'json');
    try {
      const result = await this.geminiClient.callWithProtection({ prompt });
      const jsonString = result.data.replace(/```json\n?/, '').replace(/```$/, '').trim();
      return JSON.parse(jsonString);
    } catch (error) {
      logger.error('Error during financial data analysis:', error);
      throw new Error('Failed to parse AI analysis response.');
    }
  }

  /**
   * Processes a job in the background and stores the result in the database.
   */
  async _processInBackground(jobId, transactions) {
    logger.info(`Processing job ${jobId} in the background.`);
    try {
      await AnalysisJob.findByIdAndUpdate(jobId, { status: 'processing' });
      const analysisResult = await this.analyzeFinancialData(transactions);
      await AnalysisJob.findByIdAndUpdate(jobId, {
        status: 'complete',
        result: analysisResult,
        completedAt: new Date(),
      });
      logger.info(`Job ${jobId} completed successfully.`);
      this.sendNotification(
        process.env.NOTIFICATION_RECIPIENT_EMAIL,
        `Job ${jobId} completed successfully`,
        `Job ${jobId} completed successfully. Result: ${JSON.stringify(analysisResult)}`
      );
    } catch (error) {
      logger.error(`Error processing job ${jobId}:`, error);
      await AnalysisJob.findByIdAndUpdate(jobId, {
        status: 'failed',
        error: error.message,
        completedAt: new Date(),
      });
      this.sendNotification(
        process.env.NOTIFICATION_RECIPIENT_EMAIL,
        `Job ${jobId} failed`,
        `Error processing job ${jobId}: ${error.message}`
      );
    }
  }

  /**
   * Initiates an asynchronous deep analysis and returns a job ID.
   */
  async asyncDeepAnalysis(userId, transactions) {
    const job = new AnalysisJob({
      userId,
      status: 'queued',
      transactionCount: transactions.length,
    });
    await job.save();

    // Non-blocking call to process the job
    this._processInBackground(job._id, transactions);

    return {
      jobId: job._id,
      status: 'queued',
      message: 'Deep analysis has been queued for processing.',
    };
  }

  /**
   * Streams a financial analysis response chunk by chunk.
   */
  async streamFinancialAnalysis(transactions, callback) {
    const prompt = this._createAnalysisPrompt(transactions, 'text');
    const streamResult = await this.geminiClient.stream({ prompt });

    let fullResponse = '';
    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      callback(chunkText); // Send each chunk to the client
    }
    return fullResponse;
  }

  /**
   * Processes a large transaction history by chunking it to manage memory.
   */
  async processLargeTransactionHistory(transactions, chunkSize = 500) {
    const combinedAnalysis = {
      summary: [],
      spendingBreakdown: {},
      insights: [],
    };

    for (let i = 0; i < transactions.length; i += chunkSize) {
      const chunk = transactions.slice(i, i + chunkSize);
      const analysis = await this.analyzeFinancialData(chunk);

      // Combine results (this is a simplified aggregation)
      combinedAnalysis.summary.push(analysis.summary);
      analysis.insights.forEach(insight => combinedAnalysis.insights.push(insight));
      Object.entries(analysis.spendingBreakdown).forEach(([category, data]) => {
        if (!combinedAnalysis.spendingBreakdown[category]) {
          combinedAnalysis.spendingBreakdown[category] = { totalAmount: 0, count: 0 };
        }
        combinedAnalysis.spendingBreakdown[category].totalAmount += data.totalAmount;
        combinedAnalysis.spendingBreakdown[category].count += data.count;
      });

      if (global.gc) global.gc(); // Suggest garbage collection
    }

    // Final processing to create a coherent report
    const finalReport = {
      ...combinedAnalysis,
      summary: `Combined analysis from ${transactions.length} transactions: ` + combinedAnalysis.summary.join(' '),
    };

    return finalReport;
  }

  // --- Helper Methods ---

  _createRateLimiter(limit, interval) {
    let requests = 0;
    setInterval(() => (requests = 0), interval);
    return {
      async wait() {
        while (requests >= limit) {
          await new Promise(resolve => setTimeout(resolve, 50)); // Wait if limit is reached
        }
        requests++;
      }
    };
  }

  _generateHash(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  async sendNotification(recipient, subject, message) {
    logger.info(`Sophia Notification: ${message}`);

    if (!process.env.MAILSLURP_API_KEY || !process.env.MAILSLURP_INBOX_ID) {
      logger.warn('MailSlurp API key or Inbox ID not configured. Skipping email notification.');
      return;
    }

    try {
      await mailslurp.sendEmail(process.env.MAILSLURP_INBOX_ID, {
        to: [recipient],
        subject: subject,
        body: message,
      });
      logger.info('Email notification sent successfully.');
    } catch (error) {
      logger.error('Failed to send email notification:', error);
    }
  }
}

export default new HighCapacitySophiaService();