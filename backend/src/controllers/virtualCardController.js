// backend/src/controllers/virtualCardController.js

const { query } = require('/workspace/backend/src/config/database');
const cryptoService = require('/workspace/backend/src/services/cryptoService');
const bankTransferService = require('/workspace/backend/src/services/bankTransferService');
const marqetaService = require('../../../shared/services/marqetaService');

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
exports.listVirtualCards = async (req, res) => {
 try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    const result = await query('SELECT * FROM virtual_cards WHERE user_id = $1', [userId]); 
    const virtualCards = result.rows;
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
exports.getVirtualCardById = async (req, res) => {
  const cardId = req.params.cardId;

 try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    const result = await query('SELECT * FROM virtual_cards WHERE id = $1 AND user_id = $2', [cardId, userId]);
    const card = result.rows[0];

    if (card) {
      // Ensure card details are handled securely (e.g., tokenized) before sending
      // For this example, we are returning raw data as a placeholder
      res.status(200).json(card);
  } else {
      res.status(404).json({ message: 'Virtual card not found or unauthorized' });
  }
};

exports.withdrawVirtualCard = async (req, res) => {
  const cardId = req.params.cardId;
  const { amount } = req.body;
  const userId = req.user.id;

  // Remove duplicate Swagger documentation block

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid withdrawal amount' });
  }

 try {
    // Find the virtual card for the authenticated user
    const cardResult = await query('SELECT * FROM virtual_cards WHERE id = $1 AND user_id = $2', [cardId, userId]);
    const card = cardResult.rows[0];

    if (!card) {
      return res.status(404).json({ message: 'Virtual card not found or unauthorized' });
    }

    // Check for sufficient funds
    if ((card.balance || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update card balance in the database
    const newBalance = (card.balance || 0) - amount;
    await query('UPDATE virtual_cards SET balance = $1 WHERE id = $2 AND user_id = $3', [newBalance, cardId, userId]);

 res.status(200).json(card);
  } catch (error) {
 console.error('Error withdrawing from virtual card:', error);
    res.status(500).json({ message: 'Error withdrawing from virtual card' });
  }
};
exports.createVirtualCard = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    // Call Marqeta service to create a virtual card
    const cardData = await marqetaService.createCard({ userToken: userId /* other details */ });

    // IMPORTANT: In a production environment, you must encrypt all sensitive card data before storing it.
    // The pan, expiration, and cvv should be handled securely (e.g., tokenized or stored in a vault).
    const { pan, expiration, cvv } = cardData;

    // Save the new card to the database
    const result = await query(
      'INSERT INTO virtual_cards (user_id, card_number, expiry_date, cvv, balance, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, pan, expiration, cvv, 0, 'active']
    );

    const createdCard = result.rows[0];

    // Do not return sensitive data like full card number or CVV.
    // This is just for demonstration. In a real app, you would return a token or masked data.
    res.status(201).json(createdCard);
  } catch (error) {
    console.error('Error creating virtual card:', error);
    res.status(500).json({ message: 'Error creating virtual card' });
  }
};

exports.topupVirtualCard = async (req, res) => {
  const cardId = req.params.cardId;
  const { amount, method, currency } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
/**
 * @swagger
 * /api/cards/{cardId}/topup:
 *   post:
 *     summary: Top up a virtual card
 *     tags: [Virtual Cards]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the virtual card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
    return res.status(400).json({ message: 'Invalid top-up amount' });
  }

 try {
    const result = await query('SELECT * FROM virtual_cards WHERE id = $1 AND user_id = $2', [cardId, req.user.id]);
    const card = result.rows[0];

 if (card) {
    card.balance = (card.balance || 0) + amount;
    res.status(200).json(card);
  } else {
    res.status(404).json({ message: 'Virtual card not found' });
  }
  } catch (error) {
 console.error('Error topping up virtual card:', error);
    res.status(500).json({ message: 'Error topping up virtual card' });
  }
};