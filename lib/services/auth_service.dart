import 'dart:async';

class AuthService {
  // Simulates a network call to authenticate a user.
  Future<bool> login(String email, String password) async {
    // Simulate network delay
    await Future.delayed(Duration(seconds: 2));

    // Placeholder logic: accept any user/pass combination for now
    // In a real app, this would make an API call to the backend.
    if (email.isNotEmpty && password.isNotEmpty) {
      print('AuthService: Login successful for $email');
      return true;
    } else {
      print('AuthService: Login failed for $email');
      return false;
    }
  }
}