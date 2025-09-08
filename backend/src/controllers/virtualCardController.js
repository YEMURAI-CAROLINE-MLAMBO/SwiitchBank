// backend/src/controllers/virtualCardController.js

const { query } = require('/workspace/backend/src/config/database');
const ErrorResponse = require('../utils/errorResponse');

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
    const result = await query(
      'SELECT * FROM virtual_cards WHERE user_id = $1',
      [userId]
    );
    const virtualCards = result.rows;
    res.status(200).json(virtualCards); // Send the retrieved cards in the response
  } catch (error) {
    next(error);
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
    const result = await query(
      'SELECT * FROM virtual_cards WHERE id = $1 AND user_id = $2',
      [cardId, userId]
    );
    const card = result.rows[0];

    if (card) {
      // Ensure card details are handled securely (e.g., tokenized) before sending
      // For this example, we are returning raw data as a placeholder
      res.status(200).json(card);
    } else {
      res
        .status(404)
        .json({ message: 'Virtual card not found or unauthorized' });
    }
  } catch (error) {
    next(error);
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
    const cardResult = await query(
      'SELECT * FROM virtual_cards WHERE id = $1 AND user_id = $2',
      [cardId, userId]
    );
    const card = cardResult.rows[0];

    if (!card) {
      return res
        .status(404)
        .json({ message: 'Virtual card not found or unauthorized' });
    }

    // Check for sufficient funds
    if ((card.balance || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update card balance in the database
    const newBalance = (card.balance || 0) - amount;
    await query(
      'UPDATE virtual_cards SET balance = $1 WHERE id = $2 AND user_id = $3',
      [newBalance, cardId, userId]
    );

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

exports.createVirtualCard = async (req, res) => {
  try {
    // TODO: Integrate with Mastercard API (or chosen BaaS provider) to issue a virtual card.
    // This would involve making an API call with necessary details (e.g., user info)
    // and receiving card details (card number, expiry, CVV, etc.) in return.
    // For now, simulate a response with placeholder data
    // Example of saving to database using a hypothetical VirtualCard model:
    // const createdCard = await VirtualCard.create({
    //   userId: req.user.id, // Assuming user is authenticated and available in req.user
    //   cardNumber: issuedCardDetails.cardNumber, // Store securely (tokenized)
    //   expiryDate: issuedCardDetails.expiryDate,
    //   cvv: issuedCardDetails.cvv, // Store securely (tokenized)
    //   balance: 0,
    //   status: 'active',
    // });
    // res.status(201).json(createdCard);
  } catch (error) {
    next(error);
  }
};

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
 */
exports.topupVirtualCard = async (req, res) => {
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid top-up amount' });
  }

  try {
    const cardResult = await query(
      'SELECT * FROM virtual_cards WHERE id = $1 AND user_id = $2',
      [req.params.cardId, req.user.id]
    );
    const card = cardResult.rows[0];

    if (card) {
      card.balance = (card.balance || 0) + amount;
      res.status(200).json(card);
    } else {
      res.status(404).json({ message: 'Virtual card not found' });
    }
  } catch (error) {
    next(error);
  }
};
