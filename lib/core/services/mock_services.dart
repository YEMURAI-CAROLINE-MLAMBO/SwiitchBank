
// lib/core/services/mock_services.dart

import '../models/webhook_payloads.dart';

/// Mock implementation of a local database for storing transactions and analysis.
class MockLocalDatabase {
  final List<PlaidTransaction> transactions = [];
  final Map<String, dynamic> aiAnalysis = {};

  Future<void> storeTransaction(PlaidTransaction transaction) async {
    print('DATABASE: Storing transaction ${transaction.transactionId}');
    transactions.add(transaction);
  }

  Future<void> storeAIAnalysis(String id, dynamic analysis) async {
    print('DATABASE: Storing AI analysis for id $id');
    aiAnalysis[id] = analysis;
  }
}

/// Mock implementation of the application's state manager.
class MockAppState {
  final List<PlaidTransaction> transactionList = [];
  StripePayment latestPayment;

  Future<void> updateTransactionList(PlaidTransaction transaction) async {
    print('APP STATE: Updating transaction list with transaction from ${transaction.date}');
    transactionList.add(transaction);
  }

  Future<void> updatePaymentStatus(StripePayment payment) async {
    print('APP STATE: Updating payment status for payment ${payment.id}');
    latestPayment = payment;
  }
}

/// Mock implementation of the security orchestrator.
class MockSecurityOrchestrator {
  Future<void> processTransaction(PlaidTransaction transaction) async {
    print('SECURITY: Processing transaction for ${transaction.merchantName}');
    // In a real scenario, this would involve fraud checks, etc.
  }
}

/// Mock implementation of the payment service.
class MockPaymentService {
    Future<void> recordPayment(StripePayment payment) async {
    print('PAYMENT SERVICE: Recording payment for ${payment.id} with status ${payment.status}');
  }
}

/// Mock implementation of the portfolio service.
class MockPortfolioService {
  Future<void> updateCryptoHoldings(dynamic cryptoUpdate) async {
    print('PORTFOLIO SERVICE: Updating crypto holdings.');
  }
}

// Global instances of our mock services to be used throughout the app.
final mockLocalDatabase = MockLocalDatabase();
final mockAppState = MockAppState();
final mockSecurityOrchestrator = MockSecurityOrchestrator();
final mockPaymentService = MockPaymentService();
final mockPortfolioService = MockPortfolioService();
