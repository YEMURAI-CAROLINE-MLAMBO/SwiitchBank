import sophiaService from '../services/sophiaService.js';
import EnhancedSophiaService from '../services/EnhancedSophiaService.js';

const enhancedSophiaService = new EnhancedSophiaService();

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

export const handleEnhancedChat = async (req, res) => {
  try {
    const { message, history, context, personalization_level } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = await enhancedSophiaService.contextualChat(message, history, context);
    res.json(response);
  } catch (error) {
    console.error('Error in Enhanced Sophia chat:', error);
    res.status(500).json({ message: 'Error in Enhanced Sophia chat' });
  }
};

export const handleBehavioralInsights = async (req, res) => {
  try {
    // In a real application, you would get the user's transactions and context
    // based on the authenticated user (e.g., from req.user).
    const transactions = await enhancedSophiaService._getUserTransactions(); // Using the service method
    const userContext = {}; // Placeholder for user's context

    const insights = await enhancedSophiaService.behavioralInsights(transactions, userContext);
    res.json(insights);
  } catch (error) {
    console.error('Error getting behavioral insights:', error);
    res.status(500).json({ message: 'Error getting behavioral insights' });
  }
};
