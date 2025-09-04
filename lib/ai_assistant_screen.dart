import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:swiitch/config.dart'; // Assuming your package name is swiitch

class AIAssistantScreen extends StatefulWidget {
  @override
  _AIAssistantScreenState createState() => _AIAssistantScreenState();
}

class _AIAssistantScreenState extends State<AIAssistantScreen> {
  final TextEditingController _promptController = TextEditingController();
  String _response = '';
  bool _isLoading = false;

  Future<void> _getAIResponse() async {
    setState(() {
      _isLoading = true;
    });

    final response = await http.post(
      Uri.parse('${AppConfig.backendUrl}/api/ai/ask'), // Use the backendUrl from the config file
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'prompt': _promptController.text}),
    );

    if (response.statusCode == 200) {
      setState(() {
        _response = json.decode(response.body)['response'];
      });
    } else {
      setState(() {
        _response = 'Error: Could not get a response from the AI assistant.';
      });
    }

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Jools AI Assistant'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _promptController,
              decoration: InputDecoration(
                labelText: 'Ask me anything...',
              ),
            ),
            SizedBox(height: 16.0),
            _isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _getAIResponse,
                    child: Text('Ask'),
                  ),
            SizedBox(height: 16.0),
            Text(_response),
          ],
        ),
      ),
    );
  }
}
