import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:swiitch/ui/providers/user_data_provider.dart';
import 'package:swiitch/core/models/user_models.dart'; // Import UserProfile

class AIAssistantScreen extends StatefulWidget {
  const AIAssistantScreen({super.key});

  @override
  State<AIAssistantScreen> createState() => _AIAssistantScreenState();
}

class _AIAssistantScreenState extends State<AIAssistantScreen> {
  final List<Map<String, String>> _messages = [];
  final TextEditingController _textController = TextEditingController();
  bool _isAwaitingAIResponse = false;

  @override
  void initState() {
    super.initState();
    // Defer the call to loadUserData until after the first frame is built.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final userProvider = Provider.of<UserDataProvider>(context, listen: false);
      // Load user data and update the initial message upon completion.
      userProvider.loadUserData().then((_) {
        if (mounted && userProvider.user != null) {
          _addInitialMessage(
              'Hi, ${userProvider.user!.name}! How can I help you today?');
        } else {
          // Fallback if user data fails to load
          _addInitialMessage('Hi! How can I help you today?');
        }
      }).catchError((_) {
        if (mounted) {
          _addInitialMessage('Hi! How can I help you today?');
          _addErrorMessage();
        }
      });
    });
  }

  void _addInitialMessage(String message) {
    // Ensure we only add one initial message
    if (_messages.isEmpty) {
      setState(() {
        _messages.insert(0, {'sender': 'Jools', 'message': message});
      });
    }
  }

  void _handleSubmitted(String text) {
    if (text.trim().isEmpty) return;

    _textController.clear();
    setState(() {
      _messages.insert(0, {'sender': 'user', 'message': text});
      _isAwaitingAIResponse = true;
    });

    // TODO: Integrate with JoolsFinancialService or another AI service
    // This is a placeholder to show the asynchronous nature of the AI response.
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _messages.insert(0,
              {'sender': 'Jools', 'message': 'This feature is coming soon.'});
          _isAwaitingAIResponse = false;
        });
      }
    });
  }

  void _addErrorMessage() {
    setState(() {
      _messages.insert(0, {
        'sender': 'Jools',
        'message': 'Sorry, I had trouble loading your user data.'
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Jools Assistant')),
        body: Consumer<UserDataProvider>(
          builder: (context, provider, child) {
            // Show a loading spinner only when fetching the initial user data.
            if (provider.loading && _messages.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }
            return child!;
          },
          child: Column(
            children: <Widget>[
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(8.0),
                  reverse: true,
                  itemCount: _messages.length,
                  itemBuilder: (BuildContext context, int index) {
                    final message = _messages[index];
                    final isUser = message['sender'] == 'user';
                    return Align(
                      alignment:
                          isUser ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(
                            vertical: 4.0, horizontal: 8.0),
                        padding: const EdgeInsets.all(12.0),
                        decoration: BoxDecoration(
                          color: isUser
                              ? Theme.of(context).colorScheme.primary
                              : Colors.grey[300],
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                        child: Text(
                          message['message']!,
                          style: TextStyle(
                            color: isUser ? Colors.white : Colors.black,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              if (_isAwaitingAIResponse)
                const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: CircularProgressIndicator(),
                ),
              const Divider(height: 1.0),
              _buildTextComposer(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextComposer() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
      color: Theme.of(context).cardColor,
      child: Row(
        children: <Widget>[
          Expanded(
            child: TextField(
              controller: _textController,
              onSubmitted: _handleSubmitted,
              decoration: const InputDecoration.collapsed(
                hintText: 'Ask me anything...',
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.send),
            onPressed: () => _handleSubmitted(_textController.text),
          ),
        ],
      ),
    );
  }
}