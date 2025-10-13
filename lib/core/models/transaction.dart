// lib/core/models/transaction.dart

class Transaction {
  final String name;
  final double amount;
  final DateTime date;

  Transaction({
    required this.name,
    required this.amount,
    required this.date,
  });
}
