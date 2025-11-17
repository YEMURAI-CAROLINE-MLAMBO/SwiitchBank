import 'package:flutter/material.dart';
import 'package:swiitchbank/screens/dashboard_screen.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:swiitchbank/widgets/language_selector.dart';

class WelcomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF1A365D),
              Color(0xFF2D3748),
            ],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo
            Icon(
              Icons.account_balance,
              size: 80,
              color: Colors.white,
            ),
            SizedBox(height: 20),

            // App Name
            Text(
              'SwiitchBank',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),

            // Tagline
            Text(
              AppLocalizations.of(context)!.welcome_tagline,
              style: TextStyle(
                fontSize: 18,
                color: Colors.white70,
              ),
            ),
            SizedBox(height: 40),

            // Feature Highlights
            _buildFeatureRow(context, Icons.speed, AppLocalizations.of(context)!.welcome_feature1),
            _buildFeatureRow(context, Icons.security, AppLocalizations.of(context)!.welcome_feature2),
            _buildFeatureRow(context, Icons.language, AppLocalizations.of(context)!.welcome_feature3),
            _buildFeatureRow(context, Icons.psychology, AppLocalizations.of(context)!.welcome_feature4),

            SizedBox(height: 40),

            LanguageSelector(),

            SizedBox(height: 20),

            // Get Started Button
            ElevatedButton(
              onPressed: () {
                Navigator.pushReplacementNamed(context, '/login');
              },
              child: Text(
                AppLocalizations.of(context)!.welcome_get_started,
                style: TextStyle(fontSize: 18),
              ),
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 40, vertical: 15),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureRow(BuildContext context, IconData icon, String text) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: Colors.white70, size: 20),
          SizedBox(width: 12),
          Text(
            text,
            style: TextStyle(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}