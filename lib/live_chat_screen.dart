import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LiveChatScreen extends StatefulWidget {
  @override
  _LiveChatScreenState createState() => _LiveChatScreenState();
}

class _LiveChatScreenState extends State<LiveChatScreen> {
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
        'sender': 'agent',
        'message': 'Welcome to SwiitchBank Support! I\'m Jools, your AI assistant. How can I help you?'
      });
    });
  }

  Future<void> _handleSubmitted(String text) async {
    if (text.trim().isEmpty) return;

    _textController.clear();
    setState(() {
      _messages.insert(0, {'sender': 'user', 'message': text});
      _isLoading = true;
    });

    // Prompts Jools to act as a support agent
    final String prompt = 'As a customer support agent for a mobile banking app called SwiitchBank, your name is Jools. A user has the following query: "$text". Please provide a helpful, friendly, and concise response. Do not offer to perform actions you cannot do, like making calls or opening tickets.';

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
        _addAgentResponse(data['response'] ?? 'Sorry, I can\'t help with that right now.');
      } else {
        _addAgentResponse('Sorry, something went wrong. Please try again later.');
      }
    } catch (e) {
      _addAgentResponse('I\'m having trouble connecting. Please check your internet connection and try again.');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _addAgentResponse(String message) {
    setState(() {
      _messages.insert(0, {'sender': 'agent', 'message': message});
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('AI Support Chat')),
      body: Column(
        children: <Widget>[
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8.0),
              reverse: true,
              itemCount: _messages.length,
              itemBuilder: (BuildContext context, int index) {
                final message = _messages[index];
                final isUser = message['sender'] == 'user';
                return Container(
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
                            style: TextStyle(
                                color: isUser ? Colors.white : Colors.black,
                                fontSize: 16),
                          ),
                        ),
                      ),
                    ],
                  ),
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
                decoration: InputDecoration.collapsed(hintText: 'Ask Jools anything...'),
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
