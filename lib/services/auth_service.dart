import 'dart:async';
import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AuthService {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final String? _apiUrl = dotenv.env['API_URL']; // e.g., http://localhost:5001/api

  // Stream to notify the app of authentication changes
  Stream<User?> get user => _firebaseAuth.authStateChanges();

  // Get the current user
  User? get currentUser => _firebaseAuth.currentUser;

  /// Signs up a new user with email, password, and other details.
  Future<UserCredential> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    if (_apiUrl == null) {
      throw Exception('API_URL environment variable is not set.');
    }

    try {
      // 1. Create user in Firebase Authentication
      UserCredential userCredential = await _firebaseAuth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      await userCredential.user?.updateDisplayName('$firstName $lastName');

      // 2. Get the ID token from Firebase
      String? token = await userCredential.user?.getIdToken();
      if (token == null) {
        throw Exception('Could not retrieve Firebase ID token.');
      }

      // 3. Register user in the backend database
      final response = await http.post(
        Uri.parse('$_apiUrl/auth/signup'),
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: json.encode({
          'email': email,
          'firstName': firstName,
          'lastName': lastName,
          'swiitchBankId': userCredential.user!.uid,
        }),
      );

      if (response.statusCode != 201) {
        // If backend registration fails, delete the Firebase user to keep systems in sync
        await userCredential.user?.delete();
        throw Exception('Failed to register user on the backend: ${response.body}');
      }

      return userCredential;
    } on FirebaseAuthException catch (e) {
      // Provide more specific error messages
      throw Exception('Firebase signup failed: ${e.message}');
    } catch (e) {
      throw Exception('An unexpected error occurred during sign up: $e');
    }
  }

  /// Logs in a user with email and password.
  Future<UserCredential> login({
    required String email,
    required String password,
  }) async {
    try {
      // Firebase handles the login. The authStateChanges stream will notify the app.
      return await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw Exception('Firebase login failed: ${e.message}');
    } catch (e) {
      throw Exception('An unexpected error occurred during login: $e');
    }
  }

  /// Logs out the current user.
  Future<void> logout() async {
    try {
      await _firebaseAuth.signOut();
    } catch (e) {
      throw Exception('An error occurred during logout: $e');
    }
  }
}