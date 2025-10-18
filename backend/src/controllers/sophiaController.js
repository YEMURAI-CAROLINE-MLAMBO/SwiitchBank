import HighCapacitySophiaService from '../services/HighCapacitySophiaService.js';

export const handleChat = async (req, res) => {
  const sophiaService = new HighCapacitySophiaService();
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    await sophiaService.streamFinancialAnalysis(
      [...history, message],
      (chunk) => {
        res.write(chunk);
      }
    );

    res.end();

  } catch (error) {
    console.error('Error in Sophia chat:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error in Sophia chat' });
    } else {
      res.end();
    }
  }
};

export const getGeneratedInsights = async (req, res) => {
    const sophiaService = new HighCapacitySophiaService();
    try {
        const insights = await sophiaService.analyzeFinancialData(req.body.transactions);
        res.json({ insights });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const askQuestion = async (req, res) => {
    const sophiaService = new HighCapacitySophiaService();
    try {
        const { question } = req.body;
        const answer = await sophiaService.analyzeFinancialData([{question: question}]);
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}