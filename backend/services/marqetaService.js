const axios = require('axios');
const crypto = require('crypto');

class MarqetaService {
    constructor() {
        this.baseURL = process.env.MARQETA_BASE_URL || 'https://sandbox-api.marqeta.com/v3';
        this.appToken = process.env.MARQETA_APP_TOKEN;
        this.accessToken = process.env.MARQETA_ACCESS_TOKEN;
        this.defaultCardProgram = process.env.MARQETA_DEFAULT_CARD_PROGRAM;
        
        this.client = axios.create({
            baseURL: this.baseURL,
            auth: {
                username: this.appToken,
                password: this.accessToken
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Create a user in Marqeta
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Marqeta user object
     */
    async createUser(userData) {
        try {
            const response = await this.client.post('/users', {
                token: userData.id || crypto.randomUUID(),
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                birthday: userData.birthday,
                address1: userData.address1,
                city: userData.city,
                state: userData.state,
                zip: userData.zip,
                country: userData.country,
                phone: userData.phone,
                metadata: {
                    internal_user_id: userData.id,
                    signup_ip: userData.signupIp
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error creating Marqeta user:', error.response?.data || error.message);
            throw new Error(`Failed to create user in Marqeta: ${error.response?.data?.error_message || error.message}`);
        }
    }

    /**
     * Create a virtual card in Marqeta
     * @param {Object} cardData - Card data
     * @returns {Promise<Object>} Marqeta card object
     */
    async createVirtualCard(cardData) {
        try {
            const response = await this.client.post('/cards', {
                user_token: cardData.userToken,
                card_product_token: cardData.cardProductToken || this.defaultCardProgram,
                expedite: false,
                metadata: {
                    internal_user_id: cardData.userId,
                    purpose: cardData.purpose || 'general_use'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error creating virtual card:', error.response?.data || error.message);
            throw new Error(`Failed to create virtual card: ${error.response?.data?.error_message || error.message}`);
        }
    }

    /**
     * Fund the card account
     * @param {string} userToken - Marqeta user token
     * @param {number} amount - Amount to fund
     * @param {string} currency - Currency code
     * @returns {Promise<Object>} Funding response
     */
    async fundAccount(userToken, amount, currency = 'USD') {
        try {
            const response = await this.client.post('/gpaorders', {
                user_token: userToken,
                amount: amount,
                currency_code: currency,
                funding_source_token: process.env.MARQETA_FUNDING_SOURCE,
                metadata: {
                    funding_type: 'user_deposit',
                    timestamp: new Date().toISOString()
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error funding account:', error.response?.data || error.message);
            throw new Error(`Failed to fund account: ${error.response?.data?.error_message || error.message}`);
        }
    }

    /**
     * Get card details
     * @param {string} cardToken - Marqeta card token
     * @returns {Promise<Object>} Card details
     */
    async getCardDetails(cardToken) {
        try {
            const response = await this.client.get(`/cards/${cardToken}`);
            return response.data;
        } catch (error) {
            console.error('Error getting card details:', error.response?.data || error.message);
            throw new Error(`Failed to get card details: ${error.response?.data?.error_message || error.message}`);
        }
    }

    /**
     * Update card status
     * @param {string} cardToken - Marqeta card token
     * @param {string} status - New status ('ACTIVE', 'SUSPENDED', 'TERMINATED')
     * @returns {Promise<Object>} Updated card details
     */
    async updateCardStatus(cardToken, status) {
        try {
            const response = await this.client.put(`/cards/${cardToken}`, {
                state: status.toLowerCase()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating card status:', error.response?.data || error.message);
            throw new Error(`Failed to update card status: ${error.response?.data?.error_message || error.message}`);
        }
    }

    /**
     * Get transaction details
     * @param {string} transactionToken - Marqeta transaction token
     * @returns {Promise<Object>} Transaction details
     */
    async getTransaction(transactionToken) {
        try {
            const response = await this.client.get(`/transactions/${transactionToken}`);
            return response.data;
        } catch (error) {
            console.error('Error getting transaction:', error.response?.data || error.message);
            throw new Error(`Failed to get transaction: ${error.response?.data?.error_message || error.message}`);
        }
    }

    /**
     * Simulate a transaction (for sandbox testing)
     * @param {Object} transactionData - Transaction data
     * @returns {Promise<Object>} Simulated transaction response
     */
    async simulateTransaction(transactionData) {
        try {
            const response = await this.client.post('/simulate/authorization', {
                amount: transactionData.amount,
                card_token: transactionData.cardToken,
                mid: transactionData.merchantId || '123456789012345',
                is_pre_auth: transactionData.isPreAuth || false
            });
            return response.data;
        } catch (error) {
            console.error('Error simulating transaction:', error.response?.data || error.message);
            throw new Error(`Failed to simulate transaction: ${error.response?.data?.error_message || error.message}`);
        }
    }

    /**
     * Handle Marqeta webhook
     * @param {Object} webhookData - Webhook payload
     * @returns {Promise<Object>} Processing result
     */
    async handleWebhook(webhookData) {
        try {
            // Verify webhook signature
            const isValid = this.verifyWebhookSignature(webhookData);
            if (!isValid) {
                throw new Error('Invalid webhook signature');
            }

            const { type, data } = webhookData;

            switch (type) {
                case 'authorization.transition':
                    await this.handleAuthorizationEvent(data);
                    break;
                case 'transaction.transition':
                    await this.handleTransactionEvent(data);
                    break;
                case 'card.transition':
                    await this.handleCardEvent(data);
                    break;
                default:
                    console.log(`Unhandled webhook type: ${type}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error handling webhook:', error);
            throw error;
        }
    }

    /**
     * Verify webhook signature
     * @param {Object} webhookData - Webhook payload
     * @returns {boolean} Signature validity
     */
    verifyWebhookSignature(webhookData) {
        const signature = webhookData.signature;
        const payload = JSON.stringify(webhookData.data);
        const secret = process.env.MARQETA_WEBHOOK_SECRET;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        return signature === expectedSignature;
    }

    // Additional helper methods
    async handleAuthorizationEvent(data) {
        // Implement authorization event handling
        console.log('Authorization event:', data);
    }

    async handleTransactionEvent(data) {
        // Implement transaction event handling
        console.log('Transaction event:', data);
    }

    async handleCardEvent(data) {
        // Implement card event handling
        console.log('Card event:', data);
    }
}

module.exports = MarqetaService;