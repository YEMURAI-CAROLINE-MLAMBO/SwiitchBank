import 'package:flutter/material.dart';
import 'package:swiitch/core/theme/app_colors.dart';
import 'dart:math';

class AnimatedLogoHeader extends StatefulWidget {
  @override
  _AnimatedLogoHeaderState createState() => _AnimatedLogoHeaderState();
}

class _AnimatedLogoHeaderState extends State<AnimatedLogoHeader>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Spinning Logo
        RotationTransition(
          turns: _controller,
          child: Image.asset(
            'assets/logo.png',
            width: 80,
            height: 80,
            color: AppColors.electricBlue,
          ),
        ),
        SizedBox(height: 16),

        // Tagline with fade animation
        FadeTransition(
          opacity: AlwaysStoppedAnimation(0.8),
          child: Text(
            'Anywhere Anytime',
            style: TextStyle(
              color: AppColors.matrixGreen,
              fontSize: 18,
              fontWeight: FontWeight.w300,
              letterSpacing: 3.0,
            ),
          ),
        ),
      ],
    );
  }
}