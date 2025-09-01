// functions/src/paymentProcessors/moonpayService.js
const functions = require('firebase-functions');
const CryptoJS = require('crypto-js');

class MoonPayService {
    constructor() {
        this.baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://api.moonpay.com' 
            : 'https://api.sandbox.moonpay.com';
        this.publicKey = process.env.MOONPAY_PUBLIC_KEY;
        this.secretKey = process.env.MOONPAY_SECRET_KEY;
    }

    // Create crypto buy transaction
    async createBuyTransaction(userId, cryptoCurrency, fiatAmount, fiatCurrency, walletAddress) {
        const externalCustomerId = userId;
        const timestamp = Math.floor(Date.now() / 1000);
        
        // Create signature for secure request
        const signatureString = `?apiKey=${this.publicKey}&currencyCode=${cryptoCurrency}&walletAddress=${walletAddress}&externalCustomerId=${externalCustomerId}&timestamp=${timestamp}`;
        const signature = CryptoJS.HmacSHA256(signatureString, this.secretKey).toString();

        const response = await fetch(`${this.baseUrl}/v3/currencies/${cryptoCurrency}/buy_quote?apiKey=${this.publicKey}&baseCurrencyCode=${fiatCurrency}&baseCurrencyAmount=${fiatAmount}&externalCustomerId=${externalCustomerId}&timestamp=${timestamp}&signature=${signature}`);

        if (!response.ok) {
            throw new Error(`MoonPay API error: ${response.statusText}`);
        }

        const quote = await response.json();

        return {
            quoteId: quote.quoteId,
            cryptoAmount: quote.quoteCurrencyAmount,
            fiatAmount: quote.baseCurrencyAmount,
            feeAmount: quote.feeAmount,
            totalAmount: quote.totalAmount,
            expiration: quote.expiresAt,
            widgetUrl: `${this.baseUrl}/transaction?apiKey=${this.publicKey}&transactionId=${quote.quoteId}`
        };
    }

    // Webhook handler for transaction updates
    async handleWebhook(webhookData) {
        // Verify webhook signature
        const signature = CryptoJS.HmacSHA256(JSON.stringify(webhookData), this.secretKey).toString();
        
        if (signature !== webhookData.signature) {
            throw new Error('Invalid webhook signature');
        }

        const { type, data } = webhookData;

        switch (type) {
            case 'transaction_created':
                await this.handleTransactionCreated(data);
                break;
            case 'transaction_updated':
                await this.handleTransactionUpdated(data);
                break;
            case 'transaction_failed':
                await this.handleTransactionFailed(data);
                break;
        }

        return { success: true };
    }

    async handleTransactionCreated(data) {
        console.log('Transaction created:', data);
        // TODO: Implement logic to handle transaction creation
    }

    async handleTransactionUpdated(data) {
        console.log('Transaction updated:', data);
        // TODO: Implement logic to handle transaction updates
    }

    async handleTransactionFailed(data) {
        console.log('Transaction failed:', data);
        // TODO: Implement logic to handle failed transactions
    }
}

module.exports = new MoonPayService();
