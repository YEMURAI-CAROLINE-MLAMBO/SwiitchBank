
// lib/services/webhooks/user_webhook_setup.dart
import '../../core/webhooks/webhook_strategy.dart';

/// 👤 User-Driven Webhook Configuration
/// Users connect THEIR services to send US webhooks
class UserWebhookSetup {

  /// Guide user to set up Plaid webhooks to our endpoint
  static String getPlaidWebhookGuide(String userId) {
    final webhookUrl = '${WebhookReceiver.getBaseUrl()}/webhooks/transactions';

    return '''
    🔗 Connect Your Bank Accounts via Webhooks:

    1. Go to your Plaid dashboard
    2. Add this Webhook URL: $webhookUrl
    3. Select these event types:
       - TRANSACTIONS::NEW
       - TRANSACTIONS::REMOVED
       - TRANSACTIONS::MODIFIED

    ✅ Plaid will now send transaction data directly to SwiitchBank!
    ''';
  }

  /// Guide user to set up Stripe webhooks
  static String getStripeWebhookGuide(String userId) {
    final webhookUrl = '${WebhookReceiver.getBaseUrl()}/webhooks/payments';

    return '''
    💳 Connect Your Stripe Account via Webhooks:

    1. Go to Stripe Dashboard → Developers → Webhooks
    2. Add this Webhook URL: $webhookUrl
    3. Select these events:
       - payment_intent.succeeded
       - payment_intent.failed
       - charge.succeeded

    ✅ Stripe will now send payment data directly to SwiitchBank!
    ''';
  }

  /// Guide user to set up crypto exchange webhooks
  static String getCryptoWebhookGuide(String userId) {
    final webhookUrl = '${WebhookReceiver.getBaseUrl()}/webhooks/crypto';

    return '''
    ₿ Connect Your Crypto Exchanges via Webhooks:

    For Binance/MoonPay/other exchanges:
    1. Go to your exchange API settings
    2. Add this Webhook URL: $webhookUrl
    3. Enable balance and transaction events

    ✅ Your exchange will now send crypto data directly to SwiitchBank!
    ''';
  }
}
