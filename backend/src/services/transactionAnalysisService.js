import { GoogleGenerativeAI } from '@google/generative-ai';
import ProtectedAPIClient from '../external/APIClients.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// The actual client logic is now wrapped in the ProtectedAPIClient
const geminiClient = new ProtectedAPIClient({
  call: async (request) => {
    const result = await model.generateContent(request.prompt);
    const response = await result.response;
    return { data: response.text() };
  }
});

async function getAnalysis(prompt, transactions) {
  const fullPrompt = `
    Analyze the following transactions and answer the user's question.
    User's question: ${prompt}
    Transactions: ${JSON.stringify(transactions)}
  `;

  const result = await geminiClient.callWithProtection({ prompt: fullPrompt });
  return result.data;
}

export { getAnalysis };
