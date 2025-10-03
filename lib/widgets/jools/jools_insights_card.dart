import 'dart:ui';
import 'package:flutter/material.dart';

class JoolsInsightsCard extends StatelessWidget {
  final String title;
  final String insight;
  final IconData icon;

  const JoolsInsightsCard({
    Key? key,
    required this.title,
    required this.insight,
    required this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final glowColor = theme.colorScheme.secondary;

    return ClipRRect(
      borderRadius: BorderRadius.circular(20.0),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
        child: Container(
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(20.0),
            border: Border.all(
              color: glowColor.withOpacity(0.3),
            ),
            boxShadow: [
              BoxShadow(
                color: glowColor.withOpacity(0.2),
                blurRadius: 15.0,
                spreadRadius: 3.0,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: glowColor, size: 24),
                  const SizedBox(width: 12),
                  Text(
                    title,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: glowColor,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 15),
              Text(
                insight,
                style: theme.textTheme.bodyLarge?.copyWith(fontSize: 16),
              ),
            ],
          ),
        ),
      ),
    );
  }
}