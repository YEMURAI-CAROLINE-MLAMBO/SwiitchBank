import 'package:flutter/material.dart';
import 'package:swiitch/core/theme/app_colors.dart';
import 'package:swiitch/ui/animations/pulse_animation.dart';

class AnimatedActionChips extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12.0,
      runSpacing: 12.0,
      children: [
        _buildChip("Check Balance"),
        _buildChip("Recent Transactions"),
        _buildChip("Transfer Funds"),
      ],
    );
  }

  Widget _buildChip(String label) {
    return PulseAnimation(
      child: ActionChip(
        label: Text(label),
        onPressed: () {},
        backgroundColor: AppColors.moonGlow,
        labelStyle: TextStyle(color: Colors.white),
      ),
    );
  }
}