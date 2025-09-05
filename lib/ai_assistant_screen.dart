
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AIAssistantScreen extends StatefulWidget {
  @override
  _AIAssistantScreenState createState() => _AIAssistantScreenState();
}

class _AIAssistantScreenState extends State<AIAssistantScreen> {
  final TextEditingController _promptController = TextEditingController();
  String _response = '';
  bool _isLoading = false;

  Future<void> _sendPrompt() async {
    setState(() {
      _isLoading = true;
      _response = '';
    });

    try {
      final prompt = _promptController.text;
      // In a real app, you would get the transactions from your app's state
      final transactions = []; 
      
      final url = prompt.toLowerCase().contains('transactions')
          ? 'YOUR_BACKEND_URL/api/transaction-analysis/analyze'
          : 'YOUR_BACKEND_URL/api/ai/ask';

      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'prompt': prompt, 'transactions': transactions}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _response = data['response'] ?? data['analysis'];
        });
      } else {
        setState(() {
          _response = 'Error: \${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        _response = 'Error: \$e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('AI Assistant'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _promptController,
              decoration: InputDecoration(
                labelText: 'Ask a question',
              ),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: _isLoading ? null : _sendPrompt,
              child: _isLoading ? CircularProgressIndicator() : Text('Send'),
            ),
            SizedBox(height: 16),
            if (_response.isNotEmpty)
              Expanded(
                child: SingleChildScrollView(
                  child: Text(_response),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
