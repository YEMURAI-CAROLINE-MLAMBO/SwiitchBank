import 'package:flutter/material.dart';
import 'package:swiitchbank/theme/swiitchbank_theme.dart';
import 'package:swiitchbank/screens/welcome_screen.dart';
import 'package:swiitchbank/screens/login_screen.dart';
import 'package:swiitchbank/screens/dashboard_screen.dart';

void main() {
  runApp(SwiitchBankApp());
}

class SwiitchBankApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SwiitchBank',
      theme: SwiitchBankTheme.lightTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => WelcomeScreen(),
        '/login': (context) => LoginScreen(),
        '/dashboard': (context) => DashboardScreen(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}