import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:swiitchbank/main_screen.dart';

class OnboardingScreen extends StatefulWidget {
  @override
  _OnboardingScreenState createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  bool _isLoading = false;

  Future<void> _getOnboardingHelp() async {
    setState(() {
      _isLoading = true;
    });

    const String prompt = 'Hi Jools, I\'m new to SwiitchBank. Can you give me a quick tour of the app\'s main features? Explain what I can do with transaction analysis and how you can help me navigate the app.';

    try {
      // IMPORTANT: Replace with your actual backend URL
      const String backendUrl = 'YOUR_BACKEND_URL';
      final response = await http.post(
        Uri.parse('$backendUrl/api/ai/ask'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'prompt': prompt}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _showHelpDialog(data['response'] ?? 'Sorry, I can\'t provide help right now.');
      } else {
        _showErrorDialog('Failed to get help from the assistant.');
      }
    } catch (e) {
      _showErrorDialog('An error occurred while contacting the assistant.');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showHelpDialog(String content) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Welcome to SwiitchBank!'),
        content: SingleChildScrollView(child: Text(content)),
        actions: [
          TextButton(
            child: Text('Awesome!'),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            child: Text('OK'),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => MainScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Text(
                'Welcome to SwiitchBank',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),
              Text(
                'Your smart, simple, and secure banking partner.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18, color: Colors.grey[700]),
              ),
              SizedBox(height: 50),
              _isLoading
                  ? CircularProgressIndicator()
                  : ElevatedButton.icon(
                      onPressed: _getOnboardingHelp,
                      icon: Icon(Icons.assistant),
                      label: Text('Ask Jools for a Tour'),
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                        textStyle: TextStyle(fontSize: 16),
                      ),
                    ),
              SizedBox(height: 20),
              TextButton(
                onPressed: _navigateToHome,
                child: Text('Skip and Go to App'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
