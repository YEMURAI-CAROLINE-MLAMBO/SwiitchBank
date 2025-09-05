const transactionAnalysisService = require('../services/transactionAnalysisService');

exports.analyzeTransactions = async (req, res) => {
  try {
    const { prompt, transactions } = req.body;
    if (!prompt || !transactions) {
      return res.status(400).json({ message: 'Prompt and transactions are required' });
    }

    const analysis = await transactionAnalysisService.getAnalysis(prompt, transactions);
    res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing transactions:', error);
    res.status(500).json({ message: 'Error analyzing transactions' });
  }
};
