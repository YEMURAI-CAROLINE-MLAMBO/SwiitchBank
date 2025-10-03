import 'dart:ui';
import 'package:flutter/material.dart';

class JoolsChatBubble extends StatelessWidget {
  final String message;
  final bool isUser;

  const JoolsChatBubble({
    Key? key,
    required this.message,
    required this.isUser,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final alignment =
        isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start;
    final color = isUser
        ? theme.primaryColor.withOpacity(0.4)
        : theme.cardColor.withOpacity(0.6);
    final glowColor = theme.colorScheme.secondary;

    return Column(
      crossAxisAlignment: alignment,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(20.0),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
            child: Container(
              padding:
                  const EdgeInsets.symmetric(vertical: 12.0, horizontal: 18.0),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(20.0),
                border: Border.all(
                  color: glowColor.withOpacity(0.3),
                ),
                boxShadow: [
                  BoxShadow(
                    color: glowColor.withOpacity(0.3),
                    blurRadius: 10.0,
                    spreadRadius: 2.0,
                  ),
                ],
              ),
              child: Text(
                message,
                style: theme.textTheme.bodyLarge?.copyWith(fontSize: 16),
              ),
            ),
          ),
        ),
      ],
    );
  }
}