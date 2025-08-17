// backend/src/controllers/virtualCardController.js

// In-memory storage for virtual cards (for demonstration purposes)

const virtualCards = [];

exports.listVirtualCards = (req, res) => {
  // Return the list of virtual cards
 res.status(200).json(virtualCards);
};

exports.getVirtualCardById = (req, res) => {
 const cardId = req.params.cardId; // Corrected parameter name to match the route
  // Find the card with the matching ID
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

exports.createVirtualCard = (req, res) => {
  const newCard = {
 id: Date.now().toString(), // Simple ID generation
    ...req.body, // Assume card details are in the request body
  };
 virtualCards.push(newCard);
 res.status(201).json(newCard);
};

exports.topupVirtualCard = async (req, res) => {
  const cardId = req.params.cardId;
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
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