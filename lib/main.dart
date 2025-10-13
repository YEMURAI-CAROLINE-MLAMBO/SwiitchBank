import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:swiitch/config/app_config.dart';
import 'package:swiitch/core/theme/app_theme.dart';
import 'package:swiitch/ui/providers/user_data_provider.dart';
import 'package:swiitch/ui/screens/dashboard_screen.dart';

import 'core/security/security_orchestrator.dart';
import 'core/webhooks/webhook_strategy.dart';

Future<void> main() async {
  // Ensure that Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables (part of the old API-based approach, now handled by webhooks)
  // await AppConfig.load();

  // 🎯 USE THIS instead of API-based approach:
  await WebhookOnlyStrategy.initializeWebhookOnlyMode();

  // ✅ Your existing Gemini API still works internally
  await GeminiJoolsService.initialize();

  // ✅ Your existing security system still works
  await SecurityOrchestrator.initializeSecurityFramework();

  runApp(
    ChangeNotifierProvider(
      create: (context) => UserDataProvider(),
      child: SwiitchBankApp(),
    ),
  );
}

class SwiitchBankApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SwiitchBank',
      theme: AppTheme.darkTheme,
      home: DashboardScreen(),
    );
  }
}

