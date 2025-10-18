import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:swiitchbank/services/auth_service.dart';
import 'package:swiitchbank/theme/app_theme.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';
  bool _isLoading = false;
  String _errorMessage = '';

  Future<void> _login(AuthService authService) async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() {
        _isLoading = true;
        _errorMessage = '';
      });

      try {
        await authService.login(email: _email, password: _password);
        // The auth state listener in main.dart will handle navigation
      } on Exception catch (e) {
        setState(() {
          // Extract a user-friendly message from the exception
          _errorMessage = e.toString().replaceFirst('Exception: ', '');
        });
      } finally {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context, listen: false);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.richmontNavy,
              AppTheme.charcoalGray,
            ],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(32.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Text('SwiitchBank', style: AppTheme.headline1),
                  SizedBox(height: 8),
                  Text('Welcome Back', style: AppTheme.subtitle1),
                  SizedBox(height: 40),
                  if (_errorMessage.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Text(
                        _errorMessage,
                        style: TextStyle(color: Colors.redAccent, fontSize: 14),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  TextFormField(
                    decoration: AppTheme.inputDecoration('Email Address', Icons.email),
                    style: TextStyle(color: Colors.white),
                    validator: (value) {
                      if (value == null || !value.contains('@')) return 'Please enter a valid email';
                      return null;
                    },
                    onSaved: (value) => _email = value!,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    decoration: AppTheme.inputDecoration('Password', Icons.lock),
                    obscureText: true,
                    style: TextStyle(color: Colors.white),
                    validator: (value) {
                      if (value == null || value.length < 6) return 'Password must be at least 6 characters';
                      return null;
                    },
                    onSaved: (value) => _password = value!,
                  ),
                  SizedBox(height: 24),
                  _isLoading
                      ? CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(AppTheme.sophisticatedTeal))
                      : ElevatedButton(
                          onPressed: () => _login(authService),
                          child: Text('Log In'),
                          style: AppTheme.primaryButtonStyle,
                        ),
                  SizedBox(height: 16),
                  TextButton(
                    onPressed: () {
                      // Navigate to signup screen
                      // This will be implemented later, assuming a named route '/signup'
                    },
                    child: Text(
                      "Don't have an account? Sign Up",
                      style: TextStyle(color: AppTheme.sophisticatedTeal),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}