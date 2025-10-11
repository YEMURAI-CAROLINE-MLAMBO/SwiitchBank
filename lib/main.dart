import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:swiitch/config/app_config.dart';
import 'package:swiitch/core/security/essential_security.dart';
import 'package:swiitch/core/theme/app_theme.dart';
import 'package:swiitch/ui/providers/user_data_provider.dart';
import 'package:swiitch/ui/screens/dashboard_screen.dart';

Future<void> main() async {
  // Ensure that Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize essential security features
  await EssentialSecurity.initialize();

  // Load environment variables
  await AppConfig.load();

  runApp(
    ChangeNotifierProvider(
      create: (context) => UserDataProvider(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SwiitchBank',
      theme: AppTheme.darkTheme,
      home: DashboardScreen(),
    );
  }
}
