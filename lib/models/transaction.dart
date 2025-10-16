class Transaction {
  final String id;
  final double amount;
  final String description;
  final String currency;
  final DateTime date;

  Transaction({
    required this.id,
    required this.amount,
    required this.description,
    required this.currency,
    required this.date,
  }) {
    if (amount == 0) {
      throw ArgumentError('Transaction amount cannot be zero.');
    }
  }

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      amount: json['amount'],
      description: json['description'],
      currency: json['currency'],
      date: DateTime.parse(json['date']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'description': description,
      'currency': currency,
      'date': date.toIso8601String(),
    };
  }
}