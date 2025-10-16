import 'package:swiitch/models/transaction.dart';

class FraudDetection {
  static bool isUnusualAmount(Transaction transaction, UserHistory userHistory) {
    return transaction.amount > userHistory.averageTransaction * 10;
  }

  static bool detectRapidTransactions(List<Transaction> transactions) {
    if (transactions.length < 3) {
      return false;
    }
    final first = transactions.first.date;
    final last = transactions.last.date;
    return first.difference(last).inMinutes < 5;
  }

  static double calculateRiskScore(Transaction transaction, UserBehavior userBehavior) {
    double score = 0.0;
    if (transaction.amount > userBehavior.typicalAmount * 10) {
      score += 0.6;
    }
    // A real implementation would have more complex logic,
    // including location checks, etc.
    return score;
  }
}

class UserHistory {
  final double averageTransaction;

  UserHistory({required this.averageTransaction});
}

class UserBehavior {
  final double typicalAmount;
  final Location typicalLocation;

  UserBehavior({required this.typicalAmount, required this.typicalLocation});
}

class Location {
  final double lat;
  final double lng;

  Location({required this.lat, required this.lng});
}