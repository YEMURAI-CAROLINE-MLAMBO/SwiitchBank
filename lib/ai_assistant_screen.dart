import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:SwiitchBank/widgets/jools/jools_avatar.dart';
import 'package:SwiitchBank/widgets/jools/jools_chat_bubble.dart';

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
    _addInitialMessages();
  }

  void _addInitialMessages() {
    setState(() {
      _messages.insert(0, {
        'sender': 'Jools',
        'message':
            "Hi! I'm Jools, your AI financial co-pilot. I can:\n• Analyze spending patterns\n• Optimize currency exchanges\n• Predict market trends\n• Manage business accounts"
      });
    });
  }

  Future<void> _handleSubmitted(String text) async {
    if (text.isEmpty) return;
    _textController.clear();
    setState(() {
      _messages.insert(0, {'sender': 'user', 'message': text});
      _isLoading = true;
    });

    // Simulate AI response
    await Future.delayed(const Duration(seconds: 2));

    // Hardcoded response based on the prompt
    final aiResponse = "Analyzing... ✅\n📊 EUR strong today - converts save 1.8% vs last week\n💡 Best rate: 1 USD = 0.92 EUR";

    setState(() {
      _messages.insert(0, {'sender': 'Jools', 'message': aiResponse});
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            JoolsAvatar(),
            const SizedBox(width: 12),
            Text("Jools", style: theme.textTheme.titleLarge),
          ],
        ),
      ),
      body: Stack(
        children: [
          // Placeholder for the circuit pattern background
          Container(
            decoration: BoxDecoration(
              color: theme.primaryColor,
              // Ideally, we'd use a DecorationImage with a circuit pattern here
            ),
          ),
          Column(
            children: <Widget>[
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16.0),
                  reverse: true,
                  itemCount: _messages.length,
                  itemBuilder: (BuildContext context, int index) {
                    final message = _messages[index];
                    final isUser = message['sender'] == 'user';
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: JoolsChatBubble(
                        message: message['message']!,
                        isUser: isUser,
                      ),
                    );
                  },
                ),
              ),
              if (_isLoading)
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.secondary),
                  ),
                ),
              _buildTextComposer(),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTextComposer() {
    final theme = Theme.of(context);
    final glowColor = theme.colorScheme.secondary;

    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
        child: Container(
          margin: const EdgeInsets.all(12.0),
          padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 8.0),
          decoration: BoxDecoration(
            color: theme.cardColor.withOpacity(0.5),
            borderRadius: BorderRadius.circular(30.0),
            border: Border.all(color: glowColor.withOpacity(0.4)),
             boxShadow: [
                  BoxShadow(
                    color: glowColor.withOpacity(0.2),
                    blurRadius: 8.0,
                  ),
                ],
          ),
          child: Row(
            children: <Widget>[
              Expanded(
                child: TextField(
                  controller: _textController,
                  onSubmitted: _handleSubmitted,
                  decoration: InputDecoration.collapsed(
                    hintText: 'Type message...',
                    hintStyle: TextStyle(color: Colors.white70),
                  ),
                  style: TextStyle(color: Colors.white),
                ),
              ),
              IconButton(
                icon: Icon(Icons.send, color: glowColor),
                onPressed: () => _handleSubmitted(_textController.text),
              ),
              IconButton(
                icon: Icon(Icons.mic, color: glowColor),
                onPressed: () {
                  // Voice chat functionality to be implemented
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}