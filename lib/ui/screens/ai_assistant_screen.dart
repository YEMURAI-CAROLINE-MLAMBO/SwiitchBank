import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:swiitch/ui/widgets/chat_message.dart';

class AIAssistantScreen extends StatefulWidget {
  @override
  _AIAssistantScreenState createState() => _AIAssistantScreenState();
}

class _AIAssistantScreenState extends State<AIAssistantScreen> {
  final List<Map<String, String>> _messages = [];
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
        'message': 'Hi! How can I help you today?',
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
      });
    });
  }

  Future<void> _handleSubmitted(String text) async {
    _textController.clear();
    final userMessage = {
      'sender': 'user',
      'message': text,
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
    };
    setState(() {
      _messages.insert(0, userMessage);
      _isLoading = true;
    });

    try {
      // IMPORTANT: Replace with your actual backend URL
      const String backendUrl = 'YOUR_BACKEND_URL';
      final response = await http.post(
        Uri.parse('$backendUrl/api/ai/ask'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'prompt':
              'As a navigation assistant for a mobile banking app, your task is to identify the user\'s intent and respond with a specific navigation command if it matches one of the following keywords. Your response should ONLY be the command, without any extra text.\n\nKeywords and their corresponding navigation commands:\n- \'transactions\', \'spending\', \'history\': navigate_to_transactions\n- \'home\', \'dashboard\', \'main\': navigate_to_home\n\nUser query: "$text"'
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _handleAIResponse(data['response'] ?? 'Sorry, I can\'t help with that yet.');
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

  void _handleAIResponse(String response) {
    if (response == 'navigate_to_transactions') {
      // In a real app, you would use a navigator service to handle this.
      // For now, we'll just pop the screen.
      if (Navigator.canPop(context)) {
        Navigator.pop(context, 'transactions');
      }
    } else if (response == 'navigate_to_home') {
      if (Navigator.canPop(context)) {
        Navigator.pop(context, 'home');
      }
    } else {
      setState(() {
        _messages.insert(0, {
          'sender': 'Jools',
          'message': response,
          'id': DateTime.now().millisecondsSinceEpoch.toString(),
        });
      });
    }
  }

  void _addErrorMessage() {
    setState(() {
      _messages.insert(0, {
        'sender': 'Jools',
        'message': 'Sorry, something went wrong. Please try again.',
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Jools Assistant')),
      body: Column(
        children: <Widget>[
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8.0),
              reverse: true,
              itemCount: _messages.length,
              itemBuilder: (BuildContext context, int index) {
                final message = _messages[index];
                // Using the new ChatMessage widget with a stable ValueKey.
                return ChatMessage(
                  key: ValueKey(message['id']), // Using the stable ID as the key
                  sender: message['sender']!,
                  message: message['message']!,
                );
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
                decoration: InputDecoration.collapsed(hintText: 'Ask me anything...'),
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
