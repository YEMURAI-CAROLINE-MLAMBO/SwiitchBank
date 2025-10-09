import 'package:flutter/material.dart';

class AnimatedSparkleText extends StatelessWidget {
  final String text;
  final Color sparkleColor;

  AnimatedSparkleText({required this.text, required this.sparkleColor});

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      blendMode: BlendMode.srcIn,
      shaderCallback: (bounds) {
        return RadialGradient(
          center: Alignment.topLeft,
          radius: 1.0,
          colors: [sparkleColor, sparkleColor.withOpacity(0.7)],
          tileMode: TileMode.mirror,
        ).createShader(bounds);
      },
      child: Text(
        text,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}