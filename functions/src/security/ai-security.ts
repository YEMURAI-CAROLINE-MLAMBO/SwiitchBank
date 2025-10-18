import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "firebase-functions";

// Initialize the Gemini client (ensure API key is set in environment variables)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface UserData {
  userId: string;
  transactions: any[];
  loginHistory: { ip: string; timestamp: string }[];
  profile: { createdAt: string; };
}

interface TransactionData {
  id: string;
  amount: number;
  currency: string;
  merchant: { name: string; category: string; country: string; };
  timestamp: string;
  user: { averageTransactionAmount: number; };
}

interface RiskAnalysisResponse {
  riskScore: number; // A score from 0 to 100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  justification: string[];
  recommendedAction: 'none' | 'monitor' | 'flag' | 'block';
}

/**
 * Analyzes a user's overall behavior using AI to detect anomalies.
 * @param userData - The comprehensive data of the user.
 * @returns A detailed risk analysis object.
 */
export async function analyzeUserBehavior(userData: UserData): Promise<RiskAnalysisResponse> {
  const prompt = `
    Analyze the following user data to assess their behavioral risk profile for financial fraud.
    Provide a risk score from 0 (very low risk) to 100 (very high risk).

    Factors to consider:
    - Transaction velocity and frequency.
    - Deviations from typical spending patterns.
    - Use of new or unusual merchants.
    - Logins from multiple, geographically distant locations in a short time frame.
    - Age of the account (newer accounts may be riskier).

    User Data:
    - User ID: ${userData.userId}
    - Account Created: ${userData.profile.createdAt}
    - Recent Transactions: ${JSON.stringify(userData.transactions.slice(0, 10))}
    - Recent Logins: ${JSON.stringify(userData.loginHistory.slice(0, 5))}

    Return the analysis as a valid JSON object with the keys: "riskScore", "riskLevel", "justification", "recommendedAction".
    - "justification": An array of strings explaining the reasons for the score.
  `;

  try {
    const result = await model.generateContent(prompt);
    const jsonString = result.response.text().replace(/```json\n?/, '').replace(/```$/, '').trim();
    const analysis: RiskAnalysisResponse = JSON.parse(jsonString);
    logger.info(`AI Behavior Analysis for user ${userData.userId}`, { analysis });
    return analysis;
  } catch (error) {
    logger.error(`Error in AI behavior analysis for user ${userData.userId}:`, error);
    return {
      riskScore: 50, // Default to medium risk on error
      riskLevel: 'medium',
      justification: ['AI analysis failed, defaulting to a cautious score.'],
      recommendedAction: 'monitor',
    };
  }
}

/**
 * Assesses the risk of a single transaction using AI.
 * @param transactionData - The data for the transaction to be assessed.
 * @returns A detailed risk analysis object for the transaction.
 */
export async function assessTransactionRiskAI(transactionData: TransactionData): Promise<RiskAnalysisResponse> {
  const prompt = `
    Analyze the following financial transaction to assess its fraud risk.
    Provide a risk score from 0 (very low risk) to 100 (very high risk).

    Factors to consider:
    - Transaction amount compared to the user's average.
    - High-risk merchant categories (e.g., gift cards, money transfers).
    - Transactions in a different country than the user's norm.
    - Late-night transactions.

    Transaction Data: ${JSON.stringify(transactionData)}

    Return the analysis as a valid JSON object with the keys: "riskScore", "riskLevel", "justification", "recommendedAction".
  `;

  try {
    const result = await model.generateContent(prompt);
    const jsonString = result.response.text().replace(/```json\n?/, '').replace(/```$/, '').trim();
    const analysis: RiskAnalysisResponse = JSON.parse(jsonString);
    logger.info(`AI Transaction Risk Assessment for transaction ${transactionData.id}`, { analysis });
    return analysis;
  } catch (error) {
    logger.error(`Error in AI transaction risk assessment for tx ${transactionData.id}:`, error);
    return {
      riskScore: 50,
      riskLevel: 'medium',
      justification: ['AI analysis failed, defaulting to a cautious score.'],
      recommendedAction: 'monitor',
    };
  }
}