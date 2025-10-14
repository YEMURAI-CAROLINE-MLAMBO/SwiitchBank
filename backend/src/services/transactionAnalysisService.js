import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAnalysis(prompt, transactions) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const fullPrompt = `
    Analyze the following transactions and answer the user's question.
    User's question: ${prompt}
    Transactions: ${JSON.stringify(transactions)}
  `;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  return response.text();
}

export { getAnalysis };
