// functions/src/paymentProcessors/PaymentOrchestrator.js
class PaymentOrchestrator {
    constructor() {
        this.processors = {
            stripe: new StripeService(),
            marqeta: new MarqetaService(),
            wallet: new WalletPaymentService(),
            moonpay: new MoonPayService()
        };
    }

    // Route payments to appropriate processor
    async processPayment(userId, paymentRequest) {
        const { method, amount, currency, details } = paymentRequest;

        let result;
        switch (method) {
            case 'card':
                result = await this.processors.stripe.processCardPayment(details);
                break;
            case 'virtual_card':
                result = await this.processors.marqeta.processVirtualCardPayment(details);
                break;
            case 'google_pay':
            case 'apple_pay':
                result = await this.processors.wallet.processWalletPayment(details, amount, currency, method);
                break;
            case 'crypto_buy':
                result = await this.processors.moonpay.createBuyTransaction(userId, details.cryptoCurrency, amount, currency);
                break;
            default:
                throw new Error(`Unsupported payment method: ${method}`);
        }

        // Record transaction
        await this.recordTransaction(userId, {
            method,
            amount,
            currency,
            status: result.status || 'pending',
            processor: method,
            processorId: result.transactionId || result.paymentIntentId || result.quoteId,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return result;
    }
}
