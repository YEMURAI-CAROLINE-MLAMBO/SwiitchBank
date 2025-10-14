import sophiaService from '../services/sophiaService.js';

export const handleChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = await sophiaService.chat(message, history);
    res.json({
      response,
      analyst: 'sophia',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in Sophia chat:', error);
    res.status(500).json({ message: 'Error in Sophia chat' });
  }
};
