import 'package:flutter/foundation.dart';
import 'package:swiitch/core/models/psychometric_profile.dart';
import '../../core/models/webhook_payloads.dart';

/// A provider to manage the user's psychometric data, transactions, and payments.
class UserDataProvider with ChangeNotifier {
  FinancialProfile _profile;
  final List<PlaidTransaction> _transactions = [];
  StripePayment _latestPayment;

  UserDataProvider() : _profile = FinancialProfile.initial();

  /// The current financial profile of the user.
  FinancialProfile get profile => _profile;

  /// The list of Plaid transactions.
  List<PlaidTransaction> get transactions => _transactions;

  /// The latest Stripe payment.
  StripePayment get latestPayment => _latestPayment;

  /// Updates the user's financial profile and notifies listeners.
  void updateProfile(FinancialProfile newProfile) {
    _profile = newProfile;
    notifyListeners();
  }

  /// Adds a new transaction to the list and notifies listeners.
  void updateTransactionList(PlaidTransaction transaction) {
    _transactions.add(transaction);
    notifyListeners();
  }

  /// Updates the latest payment and notifies listeners.
  void updatePaymentStatus(StripePayment payment) {
    _latestPayment = payment;
    notifyListeners();
  }
}