import 'package:flutter/material.dart';
import 'package:swiitch/ai_assistant_screen.dart'; // Assuming your package name is swiitch

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Swiitch',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: AIAssistantScreen(),
    );
  }
}
