import 'package:flutter/material.dart';
import 'package:swiitch/core/theme/app_colors.dart';

class JoolsMessageBubble extends StatelessWidget {
  final String message;
  final bool isTyping;

  const JoolsMessageBubble({
    Key? key,
    required this.message,
    this.isTyping = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8.0),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        decoration: BoxDecoration(
          color: AppColors.starDust,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
            bottomRight: Radius.circular(20),
          ),
        ),
        child: isTyping
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    message,
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                  // Simple typing indicator
                  _TypingIndicator(),
                ],
              )
            : Text(
                message,
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
      ),
    );
  }
}

class _TypingIndicator extends StatefulWidget {
  @override
  __TypingIndicatorState createState() => __TypingIndicatorState();
}

class __TypingIndicatorState extends State<_TypingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: Tween<double>(begin: 0.5, end: 1.0).animate(_controller),
      child: Text("...", style: TextStyle(color: Colors.white, fontSize: 16)),
    );
  }
}