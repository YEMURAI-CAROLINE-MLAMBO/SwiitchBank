// lib/core/models/payment_models.dart
class PaymentRequest {
  final String fromCurrency;
  final String toCurrency;
  final double amount;
  final String recipientId;

  PaymentRequest({
    required this.fromCurrency,
    required this.toCurrency,
    required this.amount,
    required this.recipientId,
  });

  Map<String, dynamic> toJson() => {
    'from_currency': fromCurrency,
    'to_currency': toCurrency,
    'amount': amount,
    'recipient_id': recipientId,
  };
}

class PaymentResponse {
  final String transactionId;
  final String status;
  final double finalAmount;
  final double fees;
  final DateTime processedAt;

  PaymentResponse({
    required this.transactionId,
    required this.status,
    required this.finalAmount,
    required this.fees,
    required this.processedAt,
  });

  factory PaymentResponse.fromJson(Map<String, dynamic> json) {
    return PaymentResponse(
      transactionId: json['transaction_id'],
      status: json['status'],
      finalAmount: json['final_amount'].toDouble(),
      fees: json['fees'].toDouble(),
      processedAt: DateTime.parse(json['processed_at']),
    );
  }
}