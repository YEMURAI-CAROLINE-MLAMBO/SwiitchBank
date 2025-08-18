// backend/src/controllers/virtualCardController.js

// In-memory storage for virtual cards (for demonstration purposes)

const virtualCards = [];

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
 */
exports.listVirtualCards = (req, res) => {
 res.status(200).json(virtualCards);
};

exports.getVirtualCardById = (req, res) => {
 const cardId = req.params.cardId; // Corrected parameter name to match the route
  // Find the card with the matching ID
  const card = virtualCards.find(card => card.id === cardId);
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
 *         description: Virtual card not found
 */
exports.getVirtualCardById = (req, res) => {
 const cardId = req.params.cardId;
 const card = virtualCards.find(card => card.id === cardId);

 if (card) {
    res.status(200).json(card);
  } else {
    res.status(404).json({ message: 'Virtual card not found' });
  }
};

exports.withdrawVirtualCard = async (req, res) => {
  const cardId = req.params.cardId;
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
/**
 * @swagger
 * /api/cards/{cardId}/withdraw:
 *   post:
 *     summary: Withdraw funds from a virtual card
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
 *                 format: float
 *                 description: The amount to withdraw
 */
    return res.status(400).json({ message: 'Invalid withdrawal amount' });
  }

  const card = virtualCards.find(card => card.id === cardId);

  if (!card) {
    return res.status(404).json({ message: 'Virtual card not found' });
  }
  if ((card.balance || 0) < amount) {
    return res.status(400).json({ message: 'Insufficient funds' });
  }
  card.balance = (card.balance || 0) - amount;
  res.status(200).json(card);
};

/**
 * @swagger
 * /api/cards/issue:
 *   post:
 *     summary: Create a new virtual card
 *     tags: [Virtual Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define the properties expected for creating a new virtual card
 *               // e.g., cardHolderName, expiryDate, cvv, etc.
 *     responses:
 *       201:
 *         description: Virtual card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VirtualCard'
 */
exports.createVirtualCard = (req, res) => {
  const newCard = {
 id: Date.now().toString(), // Simple ID generation
    ...req.body, // Assume card details are in the request body
    // Add any other required properties with default or generated values
    balance: 0, // Initialize balance
    status: 'active' // Initialize status
  };
 virtualCards.push(newCard);
 res.status(201).json(newCard);
};

exports.topupVirtualCard = async (req, res) => {
  const cardId = req.params.cardId;
  const { amount } = req.body;

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

  const card = virtualCards.find(card => card.id === cardId);

  if (card) {
    card.balance = (card.balance || 0) + amount;
    res.status(200).json(card);
  } else {
    res.status(404).json({ message: 'Virtual card not found' });
  }
};