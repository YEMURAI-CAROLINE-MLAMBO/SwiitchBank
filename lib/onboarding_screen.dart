import 'package:flutter/material.dart';
import 'package:swiitch/home_screen.dart';
import 'package:swiitch/registration_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class OnboardingScreen extends StatefulWidget {
  @override
  _OnboardingScreenState createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final List<Map<String, dynamic>> _messages = [];
  final TextEditingController _textController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _addInitialMessage();
  }

  void _addInitialMessage() {
    setState(() {
      _messages.insert(0, {
        'sender': 'Jools',
        'message': 'Welcome to SwiitchBank! I am Jools, your personal AI assistant. Are you a student?',
        'quickReplies': ['Yes, I am!', 'No, tell me more.'],
      });
    });
  }

  Future<void> _handleSubmitted(String text) async {
    _textController.clear();
    setState(() {
      _messages.removeWhere((m) => m.containsKey('quickReplies'));
      _messages.insert(0, {'sender': 'user', 'message': text});
      _isLoading = true;
    });

    // Handle Quick Replies Logic
    if (text == 'Yes, I am!') {
      _showStudentOffer();
      return;
    } else if (text == 'No, tell me more.') {
      _showGeneralInfo();
      return;
    } else if (text == 'Sign me up!') {
      _startRegistration();
      return;
    } else if (text == 'Take me to the app') {
      _goToHomeScreen();
      return;
    }

    // Fallback to AI if no quick reply matches
    try {
      final response = await http.post(
        Uri.parse('YOUR_BACKEND_URL/api/ai/ask'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'prompt': text}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _messages.insert(0, {'sender': 'Jools', 'message': data['response']});
        });
      } else {
        _addErrorMessage();
      }
    } catch (e) {
      _addErrorMessage();
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showStudentOffer() {
    setState(() {
      _isLoading = false;
      _messages.insert(0, {
        'sender': 'Jools',
        'message':
            'Great! As a student, you get a \$5 bonus, no monthly fees for 4 years, and a free virtual card. Ready to join?',
        'quickReplies': ['Sign me up!', 'Take me to the app'],
      });
    });
  }

  void _showGeneralInfo() {
    setState(() {
      _isLoading = false;
      _messages.insert(0, {
        'sender': 'Jools',
        'message':
            'Swiitch is a modern bank for everyone. We have great features like transaction analysis and AI-powered assistance. Would you like to explore?',
        'quickReplies': ['Take me to the app'],
      });
    });
  }

  void _startRegistration() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => RegistrationScreen()),
    );
    setState(() {
      _isLoading = false;
    });
  }

  void _goToHomeScreen() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => HomeScreen()),
    );
  }

  void _addErrorMessage() {
    setState(() {
      _messages.insert(0, {'sender': 'Jools', 'message': 'Sorry, something went wrong.'});
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Onboarding with Jools')),
      body: Column(
        children: <Widget>[
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8.0),
              reverse: true,
              itemCount: _messages.length,
              itemBuilder: (BuildContext context, int index) {
                final message = _messages[index];
                return _buildMessage(message);
              },
            ),
          ),
          if (_isLoading)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: CircularProgressIndicator(),
            ),
          Divider(height: 1.0),
          Container(
            decoration: BoxDecoration(color: Theme.of(context).cardColor),
            child: _buildTextComposer(),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage(Map<String, dynamic> message) {
    final isUser = message['sender'] == 'user';
    return Column(
      crossAxisAlignment: isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 8.0),
          child: Row(
            mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
            children: <Widget>[
              Flexible(
                child: Container(
                  padding: const EdgeInsets.all(12.0),
                  decoration: BoxDecoration(
                    color: isUser ? Colors.blue : Colors.grey[300],
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: Text(
                    message['message']!,
                    style: TextStyle(color: isUser ? Colors.white : Colors.black, fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
        if (message.containsKey('quickReplies'))
          _buildQuickReplies(message['quickReplies'] as List<String>),
      ],
    );
  }

  Widget _buildQuickReplies(List<String> replies) {
    return Container(
      margin: const EdgeInsets.only(left: 8.0, bottom: 10.0),
      child: Wrap(
        spacing: 8.0,
        runSpacing: 4.0,
        children: replies
            .map((reply) => ActionChip(
                  label: Text(reply),
                  onPressed: () => _handleSubmitted(reply),
                  backgroundColor: Colors.blue.withOpacity(0.1),
                  labelStyle: TextStyle(color: Colors.blue.shade800),
                ))
            .toList(),
      ),
    );
  }

  Widget _buildTextComposer() {
    return IconTheme(
      data: IconThemeData(color: Theme.of(context).colorScheme.secondary),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
        child: Row(
          children: <Widget>[
            Flexible(
              child: TextField(
                controller: _textController,
                onSubmitted: _handleSubmitted,
                decoration: InputDecoration.collapsed(hintText: 'Send a message'),
              ),
            ),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 4.0),
              child: IconButton(
                icon: Icon(Icons.send),
                onPressed: () => _handleSubmitted(_textController.text),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
