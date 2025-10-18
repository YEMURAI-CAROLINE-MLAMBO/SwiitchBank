import { GoogleGenerativeAI } from '@google/generative-ai';
import ProtectedAPIClient from '../external/APIClients.js';
import Transaction from '../models/Transaction.js';
import logger from '../utils/logger.js'; // Assuming a logger utility exists

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Using a more recent model

const geminiClient = new ProtectedAPIClient({
  call: async (request) => {
    try {
      const result = await model.generateContent(request.prompt);
      const response = await result.response;
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        throw new Error(`AI generation blocked: ${response.promptFeedback.blockReason}`);
      }
      const text = response.text();
      return { data: text };
    } catch (error) {
      logger.error('Error calling Gemini API:', {
        message: error.message,
        stack: error.stack,
        details: error.details,
      });
      throw new Error('Failed to generate content from AI service.');
    }
  }
});

/**
 * Analyzes a user's transactions to identify spending patterns.
 * @param {string} userId - The ID of the user.
 * @returns {object} A structured analysis of spending by category, merchant, and trends.
 */
async function analyzeSpendingPatterns(userId) {
  const transactions = await Transaction.find({ marqetaUserToken: userId }).sort({ createdAt: -1 }).limit(200);
  if (transactions.length === 0) {
    return {
      summary: "No transaction data available for analysis.",
      patterns: [],
    };
  }

  const prompt = `
    Analyze the following list of financial transactions for user ${userId}.
    Provide a concise, insightful summary of their spending habits.
    Then, identify the top 3-5 spending categories and the top 3 merchants by total spending.
    Finally, detect any notable spending trends, such as a recent increase in a specific category.

    Output the analysis in a valid JSON format with the following keys: "summary", "topCategories", "topMerchants", "trends".
    - "summary": A string with your overall analysis.
    - "topCategories": An array of objects, each with "category" (string) and "totalAmount" (number).
    - "topMerchants": An array of objects, each with "merchant" (string) and "totalAmount" (number).
    - "trends": An array of strings describing notable trends.

    Transactions:
    ${JSON.stringify(transactions.map(t => ({
      amount: t.amount,
      currency: t.currency,
      category: t.category,
      merchant: t.merchant ? t.merchant.name : 'N/A',
      date: t.created_time
    })))}
  `;

  try {
    const result = await geminiClient.callWithProtection({ prompt });
    // Clean and parse the JSON output from the model
    const jsonString = result.data.replace(/```json\n?/, '').replace(/```$/, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    logger.error(`Failed to analyze spending patterns for user ${userId}:`, error);
    return {
      error: true,
      message: "An error occurred during transaction analysis.",
      details: error.message,
    };
  }
}

/**
 * Provides a natural language answer to a user's question based on their transactions.
 * @param {string} userId - The ID of the user.
 * @param {string} question - The user's question.
 * @returns {string} A natural language response.
 */
async function getAnalysis(userId, question) {
  const transactions = await Transaction.find({ marqetaUserToken: userId }).sort({ createdAt: -1 }).limit(100);
  if (transactions.length === 0) {
    return "I can't answer your question because there are no transactions to analyze.";
  }

  const prompt = `
    You are a helpful financial assistant. Based on the provided transaction history for the user,
    answer the following question in a clear and concise way. Do not output JSON.

    User's Question: "${question}"

    Transaction History:
    ${JSON.stringify(transactions.map(t => ({
      amount: t.amount,
      currency: t.currency,
      description: t.memo,
      category: t.category,
      merchant: t.merchant ? t.merchant.name : 'N/A',
      date: t.created_time
    })))}
  `;

  try {
    const result = await geminiClient.callWithProtection({ prompt });
    return result.data;
  } catch (error) {
    logger.error(`Failed to get analysis for user ${userId} with question "${question}":`, error);
    return "I'm sorry, I encountered an error while analyzing your transactions. Please try again later.";
  }
}


export { getAnalysis, analyzeSpendingPatterns };