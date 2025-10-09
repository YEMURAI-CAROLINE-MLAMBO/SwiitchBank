import 'package:flutter/material.dart';
import 'package:swiitch/ui/widgets/animated_balance_card.dart';
import 'package:swiitch/ui/widgets/animated_cosmic_background.dart';
import 'package:swiitch/ui/widgets/animated_logo_header.dart';
import 'package:swiitch/ui/widgets/floating_action_menu.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          AnimatedCosmicBackground(),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 20),
                  AnimatedLogoHeader(),
                  SizedBox(height: 40),
                  AnimatedBalanceCard(),
                ],
              ),
            ),
          ),
          FloatingActionMenu(),
        ],
      ),
    );
  }
}