import 'dart:math';

import 'package:flutter/material.dart';
import 'package:swiitch/core/theme/app_colors.dart';

class AnimatedCosmicBackground extends StatefulWidget {
  @override
  _AnimatedCosmicBackgroundState createState() =>
      _AnimatedCosmicBackgroundState();
}

class _AnimatedCosmicBackgroundState extends State<AnimatedCosmicBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 20),
      vsync: this,
    )..repeat();

    _rotationAnimation = Tween<double>(
      begin: 0,
      end: 2 * pi,
    ).animate(_controller);
  }

    @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _rotationAnimation,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: Alignment.center,
              radius: 1.5,
              colors: [
                AppColors.nebulaPurple.withOpacity(0.3),
                AppColors.cosmicBlack,
              ],
              stops: [0.1, 0.8],
            ),
          ),
          child: CustomPaint(
            painter: CosmicParticlesPainter(_rotationAnimation.value),
          ),
        );
      },
    );
  }
}

class CosmicParticlesPainter extends CustomPainter {
  final double rotation;
  final Paint particlePaint;

  CosmicParticlesPainter(this.rotation)
      : particlePaint = Paint()..color = Colors.white.withOpacity(0.5);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final random = Random(123);

    for (int i = 0; i < 100; i++) {
      final radius = random.nextDouble() * size.width;
      final angle = random.nextDouble() * 2 * pi;
      final particleSize = random.nextDouble() * 2;
      final x = center.dx + radius * cos(angle + rotation);
      final y = center.dy + radius * sin(angle + rotation);

      canvas.drawCircle(Offset(x, y), particleSize, particlePaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}