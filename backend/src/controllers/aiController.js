import * as aiService from '../services/aiService.js';

export const getAIAssistantResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const aiResponse = await aiService.getAIResponse(prompt);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error getting AI response:', error);
    res.status(500).json({ message: 'Error getting AI response' });
  }
};
