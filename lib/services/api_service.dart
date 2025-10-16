import 'package:swiitch/models/transaction.dart';

class ApiService {
  Future<List<Transaction>> getTransactions() async {
    // In a real app, this would make an HTTP request.
    // For this placeholder, we return an empty list.
    return [];
  }
}