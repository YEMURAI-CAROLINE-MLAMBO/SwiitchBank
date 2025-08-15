const db = require('./database');
const logger = require('../utils/logger');
const mastercardService = require('./mastercardService'); // This is still a mock
const { encrypt, decrypt } = require('../utils/encryption');

class CardService {
  async issueVirtualCard(userId, cardDetails) {
    const { currency } = cardDetails;

    const wallets = db.find('wallets', { userId, currency });
    if (wallets.length === 0) {
      throw new Error(`No ${currency} wallet found for this user.`);
    }
    const walletId = wallets[0].id;

    const mastercardResponse = await mastercardService.issueVirtualCard(cardDetails);
    if (!mastercardResponse.success) {
      throw new Error('Failed to issue card with provider.');
    }

    const { card, provider_token } = mastercardResponse;

    const newCard = db.insert('cards', {
      userId,
      walletId,
      card_type: 'VIRTUAL',
      last_four: card.lastFour,
      provider_token,
      card_number_encrypted: encrypt(card.number),
      cvv_encrypted: encrypt(card.cvv),
      expiry_date_encrypted: encrypt(card.expiryDate),
    });

    return newCard;
  }

  async getCardsByUserId(userId) {
    const cards = db.find('cards', { userId });
    // In a real app, we would join with wallets to get currency
    return cards.map(c => ({ ...c, currency: 'USD' })); // Placeholder currency
  }
}

module.exports = new CardService();
