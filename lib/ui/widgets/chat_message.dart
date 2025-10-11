import 'package:flutter/material.dart';

class ChatMessage extends StatelessWidget {
  final String sender;
  final String message;

  const ChatMessage({
    Key? key,
    required this.sender,
    required this.message,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isUser = sender == 'user';
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 8.0),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: <Widget>[
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(12.0),
              decoration: BoxDecoration(
                color: isUser ? Colors.blue : Colors.grey[300],
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Text(
                message,
                style: TextStyle(
                    color: isUser ? Colors.white : Colors.black,
                    fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
