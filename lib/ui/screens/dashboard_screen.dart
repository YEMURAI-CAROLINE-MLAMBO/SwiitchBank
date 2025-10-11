import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/models/psychometric_profile.dart';
import '../../features/psychometrics/financial_personality_quiz.dart';
import '../providers/user_data_provider.dart';
import '../widgets/animated_balance_card.dart';
import '../widgets/animated_cosmic_background.dart';
import '../widgets/animated_logo_header.dart';
import '../widgets/floating_action_menu.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      body: Stack(
        children: [
          AnimatedCosmicBackground(),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Consumer<UserDataProvider>(
                builder: (context, userData, child) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: 20),
                      AnimatedLogoHeader(),
                      SizedBox(height: 40),
                      AnimatedBalanceCard(),
                      SizedBox(height: 40),
                      Text(
                        "Your Financial Personality:",
                        style: textTheme.titleLarge,
                      ),
                      SizedBox(height: 10),
                      Text(
                        "Spending Habit: ${userData.profile.spendingHabit.name}",
                        style: textTheme.bodyLarge,
                      ),
                       Text(
                        "Risk Tolerance: ${userData.profile.riskTolerance.toStringAsFixed(2)}",
                        style: textTheme.bodyLarge,
                      ),
                      SizedBox(height: 20),
                      Center(
                        child: ElevatedButton(
                          child: Text("Take the Financial Quiz"),
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => FinancialPersonalityQuizScreen(
                                  onQuizCompleted: (FinancialProfile profile) {
                                    // The provider is already updated inside the quiz screen.
                                    // We can add any additional logic here if needed.
                                  },
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          ),
          FloatingActionMenu(),
        ],
      ),
    );
  }
}