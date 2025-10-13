
// lib/services/webhooks/webhook_data_processor.dart

import '../../core/models/webhook_payloads.dart';
import '../../core/services/mock_services.dart';
import '../../core/webhooks/webhook_strategy.dart';

/// 🔄 Webhook Data Processor
/// Processes incoming webhooks WITHOUT making outgoing API calls
class WebhookDataProcessor {

  /// Process incoming transaction webhook
  static Future<void> processTransactionWebhook(Map<String, dynamic> payload) async {
    // ✅ RECEIVE data from Plaid webhook and parse it into a structured model
    final transaction = _convertWebhookToTransaction(payload);

    // ✅ Process internally with mock security system
    await mockSecurityOrchestrator.processTransaction(transaction);

    // ✅ Analyze with existing Gemini API (internal call)
    final aiAnalysis = await GeminiJoolsService.analyzeTransaction(transaction);

    // ✅ Store locally in mock database
    await mockLocalDatabase.storeTransaction(transaction);
    await mockLocalDatabase.storeAIAnalysis(transaction.transactionId, aiAnalysis);

    // ✅ Update mock UI state
    await mockAppState.updateTransactionList(transaction);

    print('✅ Processed transaction via webhook: ${transaction.transactionId}');
  }

  /// Process incoming payment webhook
  static Future<void> processPaymentWebhook(Map<String, dynamic> payload) async {
    // ✅ RECEIVE payment data from Stripe webhook and parse it
    final payment = _convertWebhookToPayment(payload);

    // ✅ Process internally with mock payment service
    await mockPaymentService.recordPayment(payment);

    // ✅ Analyze with Gemini AI
    final paymentInsight = await GeminiJoolsService.analyzePaymentPattern(payment);

    // ✅ Update mock user interface state
    await mockAppState.updatePaymentStatus(payment);

    print('✅ Processed payment via webhook: ${payment.id}');
  }

  /// Process crypto updates via webhook
  static Future<void> processCryptoWebhook(Map<String, dynamic> payload) async {
    // ✅ RECEIVE crypto data from exchange webhooks
    final cryptoUpdate = _convertWebhookToCryptoUpdate(payload);

    // ✅ Analyze with Gemini AI
    final cryptoAnalysis = await GeminiJoolsService.analyzeCryptoPattern(cryptoUpdate);

    // ✅ Update mock portfolio locally
    await mockPortfolioService.updateCryptoHoldings(cryptoUpdate);

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

// ============== Placeholder Classes for Dependencies Not Yet Mocked ==============

class CryptoUpdate {}
class AIAnalysis {}
class PaymentInsight {}
class CryptoAnalysis {}

// Extending the GeminiJoolsService placeholder from webhook_strategy.dart
extension GeminiJoolsServiceAnalytics on GeminiJoolsService {
  static Future<AIAnalysis> analyzeTransaction(PlaidTransaction transaction) async {
    print('Placeholder: Analyzing transaction with Gemini for ${transaction.merchantName}');
    return AIAnalysis();
  }
  static Future<PaymentInsight> analyzePaymentPattern(StripePayment payment) async {
    print('Placeholder: Analyzing payment pattern with Gemini for payment ${payment.id}');
    return PaymentInsight();
  }
    static Future<CryptoAnalysis> analyzeCryptoPattern(CryptoUpdate cryptoUpdate) async {
    print('Placeholder: Analyzing crypto pattern with Gemini');
    return CryptoAnalysis();
  }
}
