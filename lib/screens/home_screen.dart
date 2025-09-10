import 'package:flutter/material.dart';
import 'package:swiitch/live_chat_screen.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Swiitch Bank'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Welcome to Swiitch Bank!', style: TextStyle(fontSize: 22)),
            SizedBox(height: 20),
            Text('Your financial dashboard is coming soon.', style: TextStyle(fontSize: 16, color: Colors.grey)),
            SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => LiveChatScreen()),
                );
              },
              icon: Icon(Icons.support_agent),
              label: Text('24/7 AI Support Chat'),
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                textStyle: TextStyle(fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
