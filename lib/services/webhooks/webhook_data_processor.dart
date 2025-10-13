
// lib/services/webhooks/webhook_data_processor.dart

import '../../core/models/webhook_payloads.dart';
import '../../ui/providers/user_data_provider.dart';
import '../database/database_service.dart';
import '../jools/gemini_jools_service.dart';
import '../payment/payment_service.dart';
import '../portfolio/portfolio_service.dart';

/// 🔄 Webhook Data Processor
/// Processes incoming webhooks WITHOUT making outgoing API calls
class WebhookDataProcessor {

  /// Process incoming transaction webhook
  static Future<void> processTransactionWebhook(Map<String, dynamic> payload) async {
    // ✅ RECEIVE data from Plaid webhook and parse it into a structured model
    final transaction = _convertWebhookToTransaction(payload);

    // In a real app, you'd get the provider from the context.
    // For this static method, we'll create a new instance.
    final userDataProvider = UserDataProvider();

    // ✅ Analyze with existing Gemini API (internal call)
    final aiAnalysis = await GeminiJoolsService.analyzeTransaction(transaction);

    // ✅ Store locally in database
    final dbService = DatabaseService();
    await dbService.storeTransaction(transaction);
    await dbService.storeAIAnalysis(transaction.transactionId, aiAnalysis);

    // ✅ Update UI state
    userDataProvider.updateTransactionList(transaction);

    print('✅ Processed transaction via webhook: ${transaction.transactionId}');
  }

  /// Process incoming payment webhook
  static Future<void> processPaymentWebhook(Map<String, dynamic> payload) async {
    // ✅ RECEIVE payment data from Stripe webhook and parse it
    final payment = _convertWebhookToPayment(payload);

    // In a real app, you'd get the provider from the context.
    final userDataProvider = UserDataProvider();

    // ✅ Process internally with payment service
    final paymentService = PaymentService();
    await paymentService.recordPayment(payment);

    // ✅ Analyze with Gemini AI
    final paymentInsight = await GeminiJoolsService.analyzePaymentPattern(payment);

    // ✅ Update user interface state
    userDataProvider.updatePaymentStatus(payment);

    print('✅ Processed payment via webhook: ${payment.id}');
  }

  /// Process crypto updates via webhook
  static Future<void> processCryptoWebhook(Map<String, dynamic> payload) async {
    // ✅ RECEIVE crypto data from exchange webhooks
    final cryptoUpdate = _convertWebhookToCryptoUpdate(payload);

    // ✅ Analyze with Gemini AI
    final cryptoAnalysis = await GeminiJoolsService.analyzeCryptoPattern(cryptoUpdate);

    // ✅ Update portfolio locally
    final portfolioService = PortfolioService();
    await portfolioService.updateCryptoHoldings(cryptoUpdate);

    print('✅ Processed crypto update via webhook');
  }

  // Private helper methods to convert webhook payloads to internal data models
  static PlaidTransaction _convertWebhookToTransaction(Map<String, dynamic> payload) {
    return PlaidTransaction.fromJson(payload);
  }

  static StripePayment _convertWebhookToPayment(Map<String, dynamic> payload) {
    final paymentIntentObject = payload['data']?['object'];
    if (paymentIntentObject is Map<String, dynamic>) {
      return StripePayment.fromJson(paymentIntentObject);
    }
    throw ArgumentError('Invalid Stripe webhook payload structure');
  }

  static CryptoUpdate _convertWebhookToCryptoUpdate(Map<String, dynamic> payload) {
    return CryptoUpdate();
  }
}

