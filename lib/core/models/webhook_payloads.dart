
// lib/core/models/webhook_payloads.dart

// A simplified representation of a Plaid transaction, based on the DEFAULT_UPDATE webhook.
class PlaidTransaction {
  final String transactionId;
  final String accountId;
  final double amount;
  final String isoCurrencyCode;
  final String merchantName;
  final String date;
  final String paymentChannel;

  PlaidTransaction({
    this.transactionId,
    this.accountId,
    this.amount,
    this.isoCurrencyCode,
    this.merchantName,
    this.date,
    this.paymentChannel,
  });

  factory PlaidTransaction.fromJson(Map<String, dynamic> json) {
    // This is a simplified mapping. A real implementation would have more robust error handling.
    return PlaidTransaction(
      transactionId: json['transaction_id'],
      accountId: json['account_id'],
      amount: (json['amount'] as num)?.toDouble(),
      isoCurrencyCode: json['iso_currency_code'],
      merchantName: json['merchant_name'],
      date: json['date'],
      paymentChannel: json['payment_channel'],
    );
  }
}

// A representation of a Stripe PaymentIntent, based on the payment_intent.succeeded webhook.
class StripePayment {
  final String id;
  final double amount;
  final String currency;
  final String customerId;
  final String status;
  final String description;
  final String statementDescriptor;

  StripePayment({
    this.id,
    this.amount,
    this.currency,
    this.customerId,
    this.status,
    this.description,
    this.statementDescriptor,
  });

  factory StripePayment.fromJson(Map<String, dynamic> json) {
    // The amount is in cents, so we convert it to the main currency unit.
    final amountInCents = (json['amount'] as num)?.toDouble();
    return StripePayment(
      id: json['id'],
      amount: amountInCents != null ? amountInCents / 100.0 : null,
      currency: json['currency'],
      customerId: json['customer'],
      status: json['status'],
      description: json['description'],
      statementDescriptor: json['statement_descriptor'],
    );
  }
}

// A generic model for security-related webhooks.
class SecurityEvent {
  final String eventType;
  final String severity;
  final String description;
  final DateTime timestamp;

  SecurityEvent({
    this.eventType,
    this.severity,
    this.description,
    this.timestamp,
  });

  factory SecurityEvent.fromJson(Map<String, dynamic> json) {
    return SecurityEvent(
      eventType: json['event_type'],
      severity: json['severity'],
      description: json['description'],
      timestamp: json['timestamp'] != null ? DateTime.tryParse(json['timestamp']) : null,
    );
  }
}
