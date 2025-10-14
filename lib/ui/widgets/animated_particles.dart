import 'package:flutter/material.dart';
import 'dart:math';

class AnimatedParticles extends StatefulWidget {
  @override
  _AnimatedParticlesState createState() => _AnimatedParticlesState();
}

class _AnimatedParticlesState extends State<AnimatedParticles>
    with SingleTickerProviderStateMixin {
  AnimationController _controller;
  List<Particle> particles;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: 10),
    )..repeat();
    particles = List.generate(100, (index) => Particle());
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: ParticlePainter(particles, _controller.value),
        );
      },
    );
  }
}

class ParticlePainter extends CustomPainter {
  final List<Particle> particles;
  final double progress;

  ParticlePainter(this.particles, this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.5)
      ..style = PaintingStyle.fill;

    particles.forEach((particle) {
      final offset = particle.calculatePosition(progress, size);
      canvas.drawCircle(offset, particle.radius, paint);
    });
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class Particle {
  final double radius;
  final double speed;
  final double initialX;
  final double initialY;
  final double direction;

  Particle()
      : radius = Random().nextDouble() * 2 + 1,
        speed = Random().nextDouble() * 20 + 10,
        initialX = Random().nextDouble(),
        initialY = Random().nextDouble(),
        direction = Random().nextDouble() * 2 * pi;

  Offset calculatePosition(double progress, Size size) {
    final dx = initialX * size.width + cos(direction) * speed * progress * 10;
    final dy = initialY * size.height + sin(direction) * speed * progress * 10;
    return Offset(dx % size.width, dy % size.height);
  }
}