
import 'dart:convert';
import 'package:shelf/shelf.dart' as shelf;
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_router/shelf_router.dart' as shelf_router;
import '../../services/webhooks/webhook_data_processor.dart';
import '../security/webhook_security.dart';


// lib/core/webhooks/webhook_strategy.dart

/// 🌐 WEBHOOK-ONLY STRATEGY
/// Uses webhooks to receive data instead of making API calls
class WebhookOnlyStrategy {

  /// ✅ WHAT WE CAN RECEIVE VIA WEBHOOKS (No registration needed):
  /// - Transaction data from Plaid webhooks
  /// - Payment notifications from Stripe webhooks
  /// - KYC updates from verification services
  /// - Security alerts from fraud detection services
  /// - Crypto updates from exchange webhooks

  /// ❌ WHAT WE AVOID (No registration required):
  /// - No Stripe API calls from our side
  /// - No Plaid API calls from our side
  /// - No Marqeta API calls from our side
  /// - No direct bank API calls

  static Future<void> initializeWebhookOnlyMode() async {
    print('🚀 Initializing Webhook-Only Mode...');

    // 1. Start webhook server to RECEIVE data
    await WebhookReceiver.initialize(port: 3000);

    // 2. Guide users to set up webhooks from THEIR services
    await _setupUserWebhookGuides();

    // 3. Process everything internally with Gemini AI
    await _initializeInternalProcessing();

    print('✅ Webhook-Only Mode Active: No API registration needed!');
  }

  /// Guide users to connect THEIR accounts via webhooks
  static Future<void> _setupUserWebhookGuides() async {
    // Users set up webhooks from their existing services to our endpoint
    // We don't call APIs - services push data to us
  }

  /// Process everything internally with your existing Gemini API
  static Future<void> _initializeInternalProcessing() async {
    // Use your existing Gemini API for all analysis
    // This doesn't require financial registration
    await GeminiJoolsService.initialize();
  }
}

///  RECEIVES INCOMING WEBHOOKS
class WebhookReceiver {
  static const String _hostname = 'localhost';
  static int _port = 3000;

  static Future<void> initialize({int port}) async {
    _port = port ?? _port;
    final app = shelf_router.Router();

    // Define routes for different webhooks
    app.post('/webhooks/transactions', _handleTransactionWebhook);
    app.post('/webhooks/payments', _handlePaymentWebhook);
    app.post('/webhooks/crypto', _handleCryptoWebhook);
    app.post('/webhooks/security', _handleSecurityWebhook);

    final handler = const shelf.Pipeline()
        .addMiddleware(shelf.logRequests())
        .addHandler(app);

    await shelf_io.serve(handler, _hostname, _port);
    print('✅ Webhook server listening on http://$_hostname:$_port');
  }

  static String getBaseUrl() {
    return 'http://$_hostname:$_port';
  }

  // Handlers for specific webhook types
  static Future<shelf.Response> _handleTransactionWebhook(shelf.Request request) async {
    final payload = await _parseRequest(request);
    await WebhookDataProcessor.processTransactionWebhook(payload);
    return shelf.Response.ok('Transaction webhook received');
  }

  static Future<shelf.Response> _handlePaymentWebhook(shelf.Request request) async {
    final payload = await _parseRequest(request);
    await WebhookDataProcessor.processPaymentWebhook(payload);
    return shelf.Response.ok('Payment webhook received');
  }

    static Future<shelf.Response> _handleCryptoWebhook(shelf.Request request) async {
    final payload = await _parseRequest(request);
    await WebhookDataProcessor.processCryptoWebhook(payload);
    return shelf.Response.ok('Crypto webhook received');
  }

  static Future<shelf.Response> _handleSecurityWebhook(shelf.Request request) async {
    final payload = await _parseRequest(request);
    await WebhookSecurity.processSecurityWebhook(payload);
    return shelf.Response.ok('Security webhook received');
  }

  // Helper to parse the request body
  static Future<Map<String, dynamic>> _parseRequest(shelf.Request request) async {
    final body = await request.readAsString();
    return jsonDecode(body) as Map<String, dynamic>;
  }
}

import '../../services/jools/gemini_jools_service.dart';
