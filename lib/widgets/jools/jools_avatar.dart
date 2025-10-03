import 'package:flutter/material.dart';

class JoolsAvatar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Theme.of(context).colorScheme.secondary.withOpacity(0.2),
        border: Border.all(
          color: Theme.of(context).colorScheme.secondary,
          width: 2,
        ),
      ),
      child: Icon(
        Icons.diamond_outlined, // Placeholder for gem/diamond icon
        color: Theme.of(context).colorScheme.secondary,
        size: 30,
      ),
    );
  }
}