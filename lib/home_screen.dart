import 'package:flutter/material.dart';
import 'package:swiitch/ai_assistant_screen.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Swiitch Bank'),
      ),
      body: Center(
        child: Text('Welcome to Swiitch Bank!'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AIAssistantScreen()),
          );
        },
        child: Icon(Icons.assistant),
        tooltip: 'AI Assistant',
      ),
    );
  }
}
