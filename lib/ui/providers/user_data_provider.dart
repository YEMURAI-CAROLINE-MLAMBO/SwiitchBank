import 'package:flutter/material.dart';
import 'package:swiitch/core/api/api_client.dart';
import 'package:swiitch/core/models/user_models.dart';

class UserDataProvider with ChangeNotifier {
  UserProfile? _user;
  List<BankAccount> _accounts = [];
  bool _loading = false;

  UserProfile? get user => _user;
  List<BankAccount> get accounts => _accounts;
  bool get loading => _loading;

  final ApiClient _apiClient = ApiClient();

  Future<void> loadUserData() async {
    _loading = true;
    notifyListeners();

    try {
      final response = await _apiClient.get('user/profile');
      _user = UserProfile.fromJson(response.data);

      final accountsResponse = await _apiClient.get('accounts');
      _accounts = (accountsResponse.data as List)
          .map((json) => BankAccount.fromJson(json))
          .toList();

    } on ApiException catch (e) {
      // In a real app, handle this more gracefully (e.g., show a toast)
      debugPrint('Failed to load user data: ${e.message}');
      rethrow; // Rethrow to allow UI to handle the error state
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
}