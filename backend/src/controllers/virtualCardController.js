// backend/src/controllers/virtualCardController.js

import VirtualCard from '../models/VirtualCard.js';
import * as cryptoService from '../services/cryptoService.js';
import * as bankTransferService from '../services/bankTransferService.js';
import * as marqetaService from '../../../shared/services/marqetaService.js';

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get a list of all virtual cards
 *     tags: [Virtual Cards]
 *     responses:
 *       200:
 *         description: A list of virtual cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VirtualCard' # Assuming you have a VirtualCard schema defined
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const listVirtualCards = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    const virtualCards = await VirtualCard.find({ userId });
    res.status(200).json(virtualCards); // Send the retrieved cards in the response
  } catch (error) {
    console.error('Error listing virtual cards:', error);
    res.status(500).json({ message: 'Error listing virtual cards' });
  }
};

/**
 * @swagger
 * /api/cards/{cardId}:
 *   get:
 *     summary: Get virtual card details by ID
 *     tags: [Virtual Cards]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the virtual card to retrieve
 *     responses:
 *       200:
 *         description: Virtual card details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VirtualCard'
 *       404:
 *         description: Virtual card not found or unauthorized
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const getVirtualCardById = async (req, res) => {
  const cardId = req.params.cardId;

  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    const card = await VirtualCard.findOne({ _id: cardId, userId });

    if (card) {
      // Ensure card details are handled securely (e.g., tokenized) before sending
      // For this example, we are returning raw data as a placeholder
      res.status(200).json(card);
    } else {
      res.status(404).json({ message: 'Virtual card not found or unauthorized' });
    }
  } catch (error) {
    console.error('Error getting virtual card by ID:', error);
    res.status(500).json({ message: 'Error getting virtual card by ID' });
  }
};

export const withdrawVirtualCard = async (req, res) => {
  const cardId = req.params.cardId;
  const { amount } = req.body;
  const userId = req.user.id;

  // Remove duplicate Swagger documentation block

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid withdrawal amount' });
  }

  try {
    // Find the virtual card for the authenticated user
    const card = await VirtualCard.findOne({ _id: cardId, userId });

    if (!card) {
      return res.status(404).json({ message: 'Virtual card not found or unauthorized' });
    }

    // Check for sufficient funds
    if (card.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update card balance in the database
    card.balance -= amount;
    await card.save();

    res.status(200).json(card);
  } catch (error) {
    console.error('Error withdrawing from virtual card:', error);
    res.status(500).json({ message: 'Error withdrawing from virtual card' });
  }
};
export const createVirtualCard = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    const { type, nickname } = req.body;

    // Call Marqeta service to create a virtual card
    const cardData = await marqetaService.createCard({ userToken: userId, type, nickname });

    // IMPORTANT: In a production environment, you must encrypt all sensitive card data before storing it.
    // The pan, expiration, and cvv should be handled securely (e.g., tokenized or stored in a vault).
    const { pan, expiration, cvv } = cardData;

    // Save the new card to the database
    const createdCard = await VirtualCard.create({
      userId,
      cardNumber: pan,
      expiryDate: expiration,
      cvv,
      balance: 0,
      status: 'active',
      type,
      nickname,
    });

    // Do not return sensitive data like full card number or CVV.
    // This is just for demonstration. In a real app, you would return a token or masked data.
    res.status(201).json(createdCard);
  } catch (error) {
    console.error('Error creating virtual card:', error);
    res.status(500).json({ message: 'Error creating virtual card' });
  }
};

export const topupVirtualCard = async (req, res) => {
  const cardId = req.params.cardId;
  const { amount, method, currency } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid top-up amount' });
  }

  try {
    const card = await VirtualCard.findOne({ _id: cardId, userId: req.user.id });

    if (card) {
      card.balance += amount;
      await card.save();
      res.status(200).json(card);
    } else {
      res.status(404).json({ message: 'Virtual card not found' });
    }
  } catch (error) {
    console.error('Error topping up virtual card:', error);
    res.status(500).json({ message: 'Error topping up virtual card' });
  }
};