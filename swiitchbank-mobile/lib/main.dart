import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:swiitchbank/services/auth_service.dart';
import 'package:swiitchbank/screens/login_screen.dart';
import 'package:swiitchbank/screens/dashboard_screen.dart';
import 'package:swiitchbank/screens/welcome_screen.dart';
import 'package:swiitchbank/providers/locale_provider.dart';
import 'package:swiitchbank/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

Future<void> main() async {
  // Ensure Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();
  // Load environment variables
  await dotenv.load(fileName: ".env");
  // Initialize Firebase
  await Firebase.initializeApp();

  runApp(
    ChangeNotifierProvider(
      create: (context) => LocaleProvider(),
      child: SwiitchBankApp(),
    ),
  );
}

class SwiitchBankApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final localeProvider = Provider.of<LocaleProvider>(context);

    return Provider<AuthService>(
      create: (_) => AuthService(),
      child: MaterialApp(
        title: 'SwiitchBank',
        theme: AppTheme.theme,
        locale: localeProvider.locale,
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: AuthWrapper(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);

    return StreamBuilder<User?>(
      stream: authService.user,
      builder: (BuildContext context, AsyncSnapshot<User?> snapshot) {
        if (snapshot.connectionState == ConnectionState.active) {
          final User? user = snapshot.data;
          // If user is null, show login screen, otherwise show dashboard
          return user == null ? WelcomeScreen() : DashboardScreen();
        }
        // While waiting for connection, show a loading indicator
        return Scaffold(
          body: Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppTheme.sophisticatedTeal),
            ),
          ),
        );
      },
    );
  }
}